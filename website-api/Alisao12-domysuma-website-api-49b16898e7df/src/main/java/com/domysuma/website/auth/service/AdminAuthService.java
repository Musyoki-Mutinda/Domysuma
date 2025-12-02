package com.domysuma.website.auth.service;

import com.domysuma.website.auth.data.*;
import com.domysuma.website.auth.util.AuthenticationFacade;
import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.RandomUtil;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.mapper.AdminUserMapper;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.model.AdminUserPasswordReset;
import com.domysuma.website.user.repository.AdminUserPasswordResetRepo;
import com.domysuma.website.user.repository.AdminUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    private final AdminUserMapper adminUserMapper;
    private final AdminUserRepo adminUserRepo;
    private final AdminUserPasswordResetRepo adminUserPasswordResetRepo;

    @Value("${jwt.expiration-in-hours.access}")
    private long accessTokenExpirationInHours;

    /**
     * Authenticate admin user, generate access + refresh tokens and build AuthResponse
     */
    public AuthResponse authenticateUser(AuthRequest authRequest) {
        var findUserByUsername = adminUserRepo.findByUsername(authRequest.getUsername());
        var findUserByEmail = adminUserRepo.findByEmail(authRequest.getUsername());

        if (findUserByUsername.isEmpty() && findUserByEmail.isEmpty()) {
            throw APIException.unauthorized("Bad credentials");
        }

        var adminUser = findUserByUsername.orElseGet(findUserByEmail::get);
        var username = adminUser.getUsername();

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, authRequest.getPassword()));

        AdminUser user = (AdminUser) authentication.getPrincipal();
        Instant now = Instant.now();

        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("domysumaarchitects.com")
                .issuedAt(now)
                .expiresAt(now.plus(accessTokenExpirationInHours, ChronoUnit.HOURS))
                .subject(format("%s,%s", user.getId(), user.getUsername()))
                .claim("id", user.getId())
                .claim("roles", scope)
                .claim("user", adminUserMapper.modelToJwtUserResponse(user))
                .build();

        String token = this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        // Build AuthResponse manually and add fullName + refreshToken + role
        var authResponse = adminUserMapper.modelToAuthResponse(user);
        authResponse.setToken(token);
        authResponse.setFullName(user.getFirstName() + " " + user.getLastName());
        authResponse.setRefreshToken(generateRefreshToken(user));
        authResponse.setRole("ADMIN");

        UserTypeStorage.clear();
        return authResponse;
    }

    /**
     * Generate refresh token for admin user
     */
    private String generateRefreshToken(AdminUser user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("domysumaarchitects.com")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.DAYS)) // refresh token validity
                .subject(format("%s,%s", user.getId(), user.getUsername()))
                .claim("id", user.getId())
                .claim("roles", "ADMIN")
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public AdminUserPasswordReset forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        var username = forgotPasswordRequest.getUsername();
        var findUser = adminUserRepo.findByUsername(username);
        var findUserByEmail = adminUserRepo.findByEmail(username);

        if (findUser.isEmpty() && findUserByEmail.isEmpty()) {
            throw APIException.notFound("User account not found");
        }

        var user = findUser.orElseGet(findUserByEmail::get);

        if (user.getUserPasswordReset() != null) {
            var existingUserPasswordReset = user.getUserPasswordReset();
            existingUserPasswordReset.setToken(RandomUtil.getRandomAlphanumeric("", 8));
            return adminUserPasswordResetRepo.save(existingUserPasswordReset);
        }

        var userPasswordReset = new AdminUserPasswordReset();
        userPasswordReset.setUser(user);
        user.setUserPasswordReset(userPasswordReset);
        adminUserRepo.save(user);
        userPasswordReset.setToken(RandomUtil.getRandomAlphanumeric("", 8));

        UserTypeStorage.clear();
        return adminUserPasswordResetRepo.save(userPasswordReset);
    }

    public ValidateTokenResponse validateToken(AuthRequest request) {
        var username = request.getUsername();
        var findUserByUsername = adminUserRepo.findByUsername(username);
        var findUserByEmail = adminUserRepo.findByEmail(username);

        if (findUserByUsername.isEmpty() && findUserByEmail.isEmpty()) {
            throw APIException.notFound("Bad credentials");
        }

        var user = findUserByUsername.orElseGet(findUserByEmail::get);
        var userPasswordReset = user.getUserPasswordReset();

        if (userPasswordReset == null || !userPasswordReset.getToken().equals(request.getPassword())) {
            throw APIException.notFound("Bad credentials");
        }

        var resetToken = RandomUtil.getRandomAlphanumeric("", 16);
        userPasswordReset.setResetToken(resetToken);

        UserTypeStorage.clear();
        return new ValidateTokenResponse(user.getId(), resetToken);
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        var findUser = adminUserRepo.findById(request.getUserId());

        if (findUser.isEmpty()) {
            throw APIException.badRequest("Invalid reset details");
        }

        var user = findUser.get();
        var userPasswordReset = user.getUserPasswordReset();

        if (userPasswordReset == null || !userPasswordReset.getResetToken().equals(request.getResetToken())) {
            throw APIException.badRequest("Invalid reset details");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        adminUserRepo.save(user);

        var authRequest = new AuthRequest();
        authRequest.setPassword(request.getPassword());
        authRequest.setUsername(user.getUsername());

        return authenticateUser(authRequest);
    }

    public UserDetails getLoggedInUser() {
        var authentication = authenticationFacade.getAuthentication();
        String username = authentication.getName().split(",")[1];
        return adminUserRepo.findByUsername(username)
                .orElseThrow(() -> APIException.notFound("User with username {0} not found", username));
    }

    public AdminUser getMe() {
        UserDetails userDetails = getLoggedInUser();
        String username = userDetails.getUsername();
        return adminUserRepo.findByUsername(username)
                .orElseThrow(() -> APIException.notFound("User with username {0} not found", username));
    }
}
