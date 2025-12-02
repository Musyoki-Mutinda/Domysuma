package com.domysuma.website.auth.service; 
import com.domysuma.website.auth.data.*; 
import com.domysuma.website.auth.util.AuthenticationFacade; 
import com.domysuma.website.core.exception.APIException; 
import com.domysuma.website.core.util.RandomUtil; 
import com.domysuma.website.user.UserTypeStorage; 
import com.domysuma.website.user.data.mapper.UserMapper; 
import com.domysuma.website.user.model.User; 
import com.domysuma.website.user.model.UserPasswordReset; 
import com.domysuma.website.user.repository.UserPasswordResetRepo; 
import com.domysuma.website.user.repository.UserRepo; 
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
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final AuthenticationFacade authenticationFacade;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;
    private final UserRepo userRepo;
    private final UserPasswordResetRepo userPasswordResetRepo;

    @Value("${jwt.expiration-in-hours.access}")
    private long accessTokenExpirationInHours;

    // ------------------------
    // Regular authentication
    // -------------------------webiste
    public AuthResponse authenticateUser(AuthRequest authRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        User user = (User) authentication.getPrincipal();

        String token = buildJwtToken(user, accessTokenExpirationInHours, "access");

        var authResponse = userMapper.modelToAuthResponse(user);
        authResponse.setToken(token);

        UserTypeStorage.clear();

        return authResponse;
    }

    // ------------------------
    // OAuth2 / Google support
    // ------------------------
    public String generateToken(User user) {
        // Now use unified "id,username" subject
        return buildJwtToken(user, accessTokenExpirationInHours, "access");
    }

    public String generateRefreshToken(User user) {
        // 1 year expiration for refresh token
        return buildJwtToken(user, 365 * 24, "refresh");
    }

    // ------------------------
    // JWT helper
    // ------------------------
    private String buildJwtToken(User user, long expirationHours, String type) {
        Instant now = Instant.now();
        String scope = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(joining(" "));

        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuer("domysumaarchitects.com")
                .issuedAt(now)
                .expiresAt(now.plus(expirationHours, ChronoUnit.HOURS))
                .subject(String.format("%s,%s", user.getId(), user.getUsername()))
                .claim("id", user.getId())
                .claim("roles", scope)
                .claim("user", userMapper.modelToJwtUserResponse(user));

        if ("refresh".equals(type)) {
            claimsBuilder.claim("type", "refresh");
        }

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsBuilder.build())).getTokenValue();
    }

    // ------------------------
    // Helper / user retrieval
    // ------------------------
    public UserDetails getLoggedInUser() {
        var authentication = authenticationFacade.getAuthentication();
        var parts = authentication.getName().split(",", 2); // safer: limit split to 2 parts
        if (parts.length < 2) {
            throw APIException.badRequest("Invalid JWT subject format");
        }
        var username = parts[1];
        return userRepo.findByUsername(username)
                .orElseThrow(() -> APIException.notFound("User with username {0} not found", username));
    }

    public User getMe() {
        UserDetails userDetails = getLoggedInUser();
        String username = userDetails.getUsername();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> APIException.notFound("User with username {0} not found", username));
    }

    // ------------------------
    // Password reset / forgot
    // ------------------------
    public UserPasswordReset forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        var username = forgotPasswordRequest.getUsername();
        var findUser = userRepo.findByUsername(username);

        if (findUser.isEmpty()) {
            throw APIException.notFound("User account not found");
        }

        var user = findUser.get();

        if (user.getUserPasswordReset() != null) {
            var existingUserPasswordReset = user.getUserPasswordReset();
            existingUserPasswordReset.setToken(RandomUtil.getRandomAlphanumeric("", 8));
            return userPasswordResetRepo.save(existingUserPasswordReset);
        }

        var userPasswordReset = new UserPasswordReset();
        userPasswordReset.setUser(user);
        user.setUserPasswordReset(userPasswordReset);
        userRepo.save(user);
        userPasswordReset.setToken(RandomUtil.getRandomAlphanumeric("", 8));

        UserTypeStorage.clear();

        return userPasswordResetRepo.save(userPasswordReset);
    }

    public ValidateTokenResponse validateToken(AuthRequest request) {
        var username = request.getUsername();
        var findUserByUsername = userRepo.findByUsername(username);

        if (findUserByUsername.isEmpty()) {
            throw APIException.notFound("Bad credentials");
        }

        var user = findUserByUsername.get();
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
        var findUser = userRepo.findById(request.getUserId());

        if (findUser.isEmpty()) {
            throw APIException.badRequest("Invalid reset details");
        }

        var user = findUser.get();
        var userPasswordReset = user.getUserPasswordReset();

        if (userPasswordReset == null || !userPasswordReset.getResetToken().equals(request.getResetToken())) {
            throw APIException.badRequest("Invalid reset details");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);

        var authRequest = new AuthRequest();
        authRequest.setPassword(request.getPassword());
        authRequest.setUsername(user.getUsername());

        return authenticateUser(authRequest);
    }
}
