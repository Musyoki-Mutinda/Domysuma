package com.domysuma.website.notification.repositories;

import com.domysuma.website.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Collection<Notification> findAllByUserId(Long userId);

    Collection<Notification> findTop10ByNotificationTypeChannelIdInAndUserIdOrderByCreatedOnDesc(List<Long> notificationTypeChannelIds, Long userId);
    Notification findTopByNotificationTypeChannelIdInAndUserId(List<Long> notificationTypeChannelIds, Long userId);
}
