package com.domysuma.website.notification.repositories;

import com.domysuma.website.notification.model.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {
    Collection<AdminNotification> findAllByUserId(Long userId);

    Collection<AdminNotification> findTop10ByNotificationTypeChannelIdInAndUserIdOrderByCreatedOnDesc(List<Long> notificationTypeChannelIds, Long userId);

    AdminNotification findTopByNotificationTypeChannelIdInAndUserId(List<Long> notificationTypeChannelIds, Long userId);
}
