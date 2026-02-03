package com.domysuma.website.notification.repositories;

import com.domysuma.website.notification.model.NotificationTypeChannel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface NotificationTypeChannelRepository extends JpaRepository<NotificationTypeChannel, Long> {
    Optional<NotificationTypeChannel> findByNotificationTypeIdAndNotificationChannelId(Long notificationTypeId, Long notificationChannelId);

    Collection<NotificationTypeChannel> findByNotificationChannelId(Long notificationChannelId);
}
