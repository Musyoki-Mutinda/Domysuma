package com.domysuma.website.user.service;

import com.domysuma.website.app.service.AppRegionService;
import com.domysuma.website.auth.service.AuthService;
import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.RandomUtil;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.dto.request.UserUpdate;
import com.domysuma.website.user.data.dto.response.UserResponse;
import com.domysuma.website.user.data.mapper.UserMapper;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final AppRegionService appRegionService;

    // ======================================================
    // 1. NORMAL USER CREATION (EMAIL + PASSWORD)
    // ======================================================
    public void createUser(UserCreate request) {
        User user = userMapper.createRequestToModel(request);

        var region = appRegionService.findRegionByIdOrThrow(request.getRegionId());

        if (request.getUsername() == null && user.getUsername() == null) {
            user.setUsername(request.getEmail());
        }

        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw APIException.conflict("Username exists!");
        }

        user.setRegion(region);
        user.setCode(RandomUtil.getRandomAlphanumeric(16));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of("USER")); // default role for normal users

        userRepo.save(user);
    }

    // ======================================================
    // 2. EDIT USER PROFILE
    // ======================================================
    public void updateUser(UserUpdate userUpdate) {
        User userToUpdate = authService.getMe();
        userMapper.updateUserToModel(userUpdate, userToUpdate);
        userRepo.save(userToUpdate);

        UserTypeStorage.clear();
    }

    // ======================================================
    // 3. GET PROFILE
    // ======================================================
    public UserResponse getProfile() {
        UserDetails userDetails = authService.getLoggedInUser();
        String username = userDetails.getUsername();
        var user = findUserByUsernameOrThrow(username);

        UserTypeStorage.clear();

        return userMapper.modelToResponse(user);
    }

    // ======================================================
    // 4. Existing method: Find user by USERNAME (internal auth)
    // ======================================================
    public User findUserByUsernameOrThrow(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() ->
                        APIException.notFound("User with username {0} not found", username));
    }

    // ======================================================
    // 🔥 NEW: Find user by EMAIL (Google OAuth)
    // ======================================================
    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    // ======================================================
    // 🔥 NEW: Find or create Google OAuth user
    // ======================================================
    public User findOrCreateGoogleUser(String email, String fullName, String avatarUrl) {
        return userRepo.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setUsername(email.split("@")[0]);
            user.setFullName(fullName);
            user.setAvatarUrl(avatarUrl);
            user.setAuthProvider("GOOGLE");
            user.setRoles(Set.of("USER")); // default role for OAuth users
            user.setCode(RandomUtil.getRandomAlphanumeric(16));
            user.setStatus(true);
            user.setPassword(null); // no password for OAuth users
            return userRepo.save(user);
        });
    }
}
