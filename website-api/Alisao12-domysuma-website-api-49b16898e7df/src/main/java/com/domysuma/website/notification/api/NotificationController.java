package com.domysuma.website.notification.api;

import com.domysuma.website.auth.service.AuthService;
import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.notification.data.dto.NotificationChannelCreate;
import com.domysuma.website.notification.data.dto.NotificationTypeChannelCreate;
import com.domysuma.website.notification.data.dto.NotificationTypeChannelUpdate;
import com.domysuma.website.notification.data.dto.NotificationTypeCreate;
import com.domysuma.website.notification.service.EmailNotificationService;
import com.domysuma.website.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Notification")
@RestController
@RequestMapping(path = "api/notification")
@RequiredArgsConstructor
public class NotificationController {
    final NotificationService notificationService;
    final EmailNotificationService emailNotificationService;
    private final AuthService authService;

    @GetMapping("web")
    public ApiResponse fetchUserWebNotifications() {
        return ApiResponse.ok(notificationService.fetchUserWebNotifications(authService.getMe().getId()));
    }

    @PutMapping("read/{id}")
    public ApiResponse markAsRead(@PathVariable Long id) {
        return ApiResponse.ok(notificationService.markAsRead(id));
    }

    @PostMapping("type")
    public ApiResponse addType(@RequestBody NotificationTypeCreate create) {
        return ApiResponse.ok(notificationService.addType(create));
    }

    @GetMapping("type")
    public ApiResponse getTypes() {
        return ApiResponse.ok(notificationService.getTypes());
    }

    @PostMapping("channel")
    public ApiResponse addChannel(@RequestBody NotificationChannelCreate create) {
        return ApiResponse.ok(notificationService.addChannel(create));
    }

    @GetMapping("channel")
    public ApiResponse getChannels() {
        return ApiResponse.ok(notificationService.getChannels());
    }

    @PostMapping("type_channel")
    public ApiResponse addTypeChannel(@RequestBody NotificationTypeChannelCreate notificationTypeChannelDto) {
        return ApiResponse.ok(notificationService.addTypeChannel(notificationTypeChannelDto));
    }

    @GetMapping("type_channel")
    public ApiResponse getTypeChannels() {
        return ApiResponse.ok(notificationService.getTypeChannels());
    }

    @PutMapping("type_channel/{typeChannelId}")
    public ApiResponse updateTypeChannel(@PathVariable Long typeChannelId, @RequestBody NotificationTypeChannelUpdate updateDto) {
        return ApiResponse.ok(notificationService.updateTypeChannelStatus(typeChannelId, updateDto));
    }
}
