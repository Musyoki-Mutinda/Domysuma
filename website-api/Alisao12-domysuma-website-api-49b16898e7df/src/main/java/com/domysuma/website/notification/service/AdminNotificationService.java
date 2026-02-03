package com.domysuma.website.notification.service;

import com.domysuma.website.notification.model.AdminNotification;
import com.domysuma.website.notification.repositories.AdminNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminNotificationService {
    private final AdminNotificationRepository notificationRepository;

    public void addSentNotification(AdminNotification notification) {
        notificationRepository.save(notification);
    }
}
