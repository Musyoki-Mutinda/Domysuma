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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Tag(name = "Client Authentication")
@RestController
@RequestMapping(path = "auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    private final String frontendUrl = "http://localhost:4200"; // adjust if needed

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
    public ApiResponse register(@RequestBody @Valid UserCreate request) {
        userService.createUser(request);
        return ApiResponse.successMessage("User created successfully");
    }

    @PostMapping("login")
    public void login(
            @RequestBody @Valid AuthRequest request,
            HttpServletResponse response
    ) throws IOException {

        UserTypeStorage.setUserType(UserType.USER);

        // Authenticate the user and get AuthResponse
        AuthResponse authResponse = authService.authenticateUser(request);

        if (authResponse == null || authResponse.getToken() == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
            return;
        }

        String accessToken = authResponse.getToken();
        String refreshToken = authResponse.getRefreshToken() != null ? authResponse.getRefreshToken() : "";
        String fullName = authResponse.getFullName() != null ? authResponse.getFullName() : "";

        // Encode params safely
        String redirectUrl = frontendUrl
                + "/google-login-success?access=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&refresh=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8)
                + "&fullName=" + URLEncoder.encode(fullName, StandardCharsets.UTF_8);

        UserTypeStorage.clear();
        response.sendRedirect(redirectUrl);
    }

    @PutMapping("forgot-password")
    public ApiResponse forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
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
    public ApiResponse validateToken(@RequestBody @Valid AuthRequest request) {
        UserTypeStorage.setUserType(UserType.USER);
        var responseObj = authService.validateToken(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }

    @PutMapping("reset-password")
    public ApiResponse resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        UserTypeStorage.setUserType(UserType.USER);
        var responseObj = authService.resetPassword(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }
}
