package com.domysuma.website.auth.api;

import com.domysuma.website.auth.data.AuthRequest;
import com.domysuma.website.auth.data.AuthResponse;
import com.domysuma.website.auth.data.ForgotPasswordRequest;
import com.domysuma.website.auth.data.ResetPasswordRequest;
import com.domysuma.website.auth.service.AuthService;
import com.domysuma.website.core.constants.ApiMessages;
import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.notification.data.enums.NotificationTypeEnum;
import com.domysuma.website.notification.events.GenericNotificationEvent;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.enums.UserType;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Client Authentication")
@RestController
@RequestMapping(path = "auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/me")
    public ApiResponse getMe() {
        User user = authService.getMe();
        return ApiResponse.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "avatarUrl", user.getAvatarUrl()
        ));
    }

    @PostMapping("register")
    public ApiResponse register(@RequestBody UserCreate request) {
        userService.createUser(request);
        return ApiResponse.successMessage("User created successfully");
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        UserTypeStorage.setUserType(UserType.USER);

        // Authenticate the user and get AuthResponse
        AuthResponse authResponse = authService.authenticateUser(request);

        if (authResponse == null || authResponse.getToken() == null) {
            return ResponseEntity.ok(Map.of("error", "Invalid credentials"));
        }

        User user = authService.getMe(); // Assuming this gets the authenticated user

        Map<String, Object> response = new HashMap<>();
        response.put("access_token", authResponse.getToken());
        response.put("refresh_token", authResponse.getRefreshToken());
        response.put("fullName", user.getFirstName() + " " + user.getLastName());
        response.put("role", user.getRoles().stream().findFirst().orElse("USER"));

        UserTypeStorage.clear();
        return ResponseEntity.ok(response);
    }

    @PutMapping("forgot-password")
    public ApiResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        UserTypeStorage.setUserType(UserType.USER);

        var passwordReset = authService.forgotPassword(request);

        if (passwordReset == null || passwordReset.getUser() == null) {
            UserTypeStorage.clear();
            return ApiResponse.ok(ApiMessages.FORGOT_PASSWORD_RESPONSE);
        }

        User user = passwordReset.getUser();
        publisher.publishEvent(new GenericNotificationEvent<>(
                this, user, user.getId(), NotificationTypeEnum.FORGOT_PASSWORD.name()
        ));

        UserTypeStorage.clear();
        return ApiResponse.ok(ApiMessages.FORGOT_PASSWORD_RESPONSE);
    }

    @PostMapping("validate-token")
    public ApiResponse validateToken(@RequestBody AuthRequest request) {
        UserTypeStorage.setUserType(UserType.USER);
        var responseObj = authService.validateToken(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }

    @PutMapping("reset-password")
    public ApiResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        UserTypeStorage.setUserType(UserType.USER);
        var responseObj = authService.resetPassword(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }
}
