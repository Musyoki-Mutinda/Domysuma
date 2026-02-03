package com.domysuma.website.notification.repositories;

import com.domysuma.website.notification.model.NotificationChannel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationChannelRepository extends JpaRepository<NotificationChannel, Long> {
    Optional<NotificationChannel> findByName(String name);
}
