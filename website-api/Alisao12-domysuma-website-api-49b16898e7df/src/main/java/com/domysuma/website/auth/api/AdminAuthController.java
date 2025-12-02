package com.domysuma.website.auth.api;

import com.domysuma.website.auth.data.AuthRequest;
import com.domysuma.website.auth.data.AuthResponse;
import com.domysuma.website.auth.data.ForgotPasswordRequest;
import com.domysuma.website.auth.data.ResetPasswordRequest;
import com.domysuma.website.auth.service.AdminAuthService;
import com.domysuma.website.core.constants.ApiMessages;
import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.notification.data.enums.NotificationTypeEnum;
import com.domysuma.website.notification.events.GenericNotificationEvent;
import com.domysuma.website.user.UserTypeStorage;
import com.domysuma.website.user.data.dto.request.UserCreate;
import com.domysuma.website.user.data.enums.UserType;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.model.Role;
import com.domysuma.website.user.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Tag(name = "Admin Auth")
@RestController
@RequestMapping(path = "/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;
    private final AdminUserService adminUserService;
    private final ApplicationEventPublisher publisher;

    // Admin frontend URL
    private final String adminFrontendUrl = "http://localhost:56875/dashboard"; // adjust as needed

    @PostMapping("register")
    @RolesAllowed({Role.ADMIN})
    public ApiResponse register(@RequestBody @Valid UserCreate request) {
        adminUserService.createUser(request);
        return ApiResponse.successMessage("User created successfully");
    }

    /**
     * Admin login
     * - Uses authenticateUser()
     * - Extracts access token, refresh token, and fullName
     * - Redirects to Angular admin app with tokens in query params
     */
    @PostMapping("login")
    public void login(@RequestBody @Valid AuthRequest request, HttpServletResponse response) throws IOException {
        UserTypeStorage.setUserType(UserType.ADMIN);

        AuthResponse authResponse = adminAuthService.authenticateUser(request);

        if (authResponse == null || authResponse.getToken() == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid admin credentials");
            return;
        }

        String accessToken = authResponse.getToken();
        String refreshToken = authResponse.getRefreshToken() != null ? authResponse.getRefreshToken() : "";
        String fullName = authResponse.getFullName() != null ? authResponse.getFullName() : "";

        // Encode params safely
        String redirectUrl = adminFrontendUrl
                + "?access=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&refresh=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8)
                + "&fullName=" + URLEncoder.encode(fullName, StandardCharsets.UTF_8);

        UserTypeStorage.clear();

        response.sendRedirect(redirectUrl);
    }

    @PutMapping("forgot-password")
    public ApiResponse forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        UserTypeStorage.setUserType(UserType.ADMIN);

        var passwordReset = adminAuthService.forgotPassword(request);

        if (passwordReset == null || passwordReset.getUser() == null) {
            UserTypeStorage.clear();
            return ApiResponse.ok(ApiMessages.FORGOT_PASSWORD_RESPONSE);
        }

        AdminUser user = passwordReset.getUser();
        publisher.publishEvent(new GenericNotificationEvent<>(
                this, user, user.getId(), NotificationTypeEnum.FORGOT_ADMIN_PASSWORD.name()
        ));

        UserTypeStorage.clear();
        return ApiResponse.ok(ApiMessages.FORGOT_PASSWORD_RESPONSE);
    }

    @PostMapping("validate-token")
    public ApiResponse validateToken(@RequestBody @Valid AuthRequest request) {
        UserTypeStorage.setUserType(UserType.ADMIN);
        var responseObj = adminAuthService.validateToken(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }

    @PutMapping("reset-password")
    public ApiResponse resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        UserTypeStorage.setUserType(UserType.ADMIN);
        var responseObj = adminAuthService.resetPassword(request);
        UserTypeStorage.clear();
        return ApiResponse.ok(responseObj);
    }
}
