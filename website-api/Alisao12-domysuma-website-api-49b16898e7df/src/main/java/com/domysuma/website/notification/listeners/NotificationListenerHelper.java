package com.domysuma.website.notification.listeners;

import com.domysuma.website.notification.model.NotificationChannel;
import com.domysuma.website.notification.model.NotificationType;
import com.domysuma.website.notification.model.NotificationTypeChannel;
import com.domysuma.website.notification.repositories.NotificationChannelRepository;
import com.domysuma.website.notification.repositories.NotificationTypeChannelRepository;
import com.domysuma.website.notification.repositories.NotificationTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
public class NotificationListenerHelper {
    final NotificationTypeRepository typeRepository;
    final NotificationChannelRepository channelRepository;
    final NotificationTypeChannelRepository typeChannelRepository;

    public NotificationListenerHelper(NotificationTypeRepository typeRepository, NotificationChannelRepository channelRepository, NotificationTypeChannelRepository typeChannelRepository) {
        this.typeRepository = typeRepository;
        this.channelRepository = channelRepository;
        this.typeChannelRepository = typeChannelRepository;
    }

    public JSONObject shouldSend(String type, String channel) {
        Optional<NotificationType> findType = typeRepository.findByName(type);
        Optional<NotificationChannel> findChannel = channelRepository.findByName(channel);

        if (findType.isEmpty() || findChannel.isEmpty()) return null;

        NotificationType notificationType = findType.get();
        NotificationChannel notificationChannel = findChannel.get();

        if (!notificationType.getIsActive() || !notificationChannel.getIsActive()) return null;

        Long notificationTypeId = notificationType.getId();
        Long notificationChannelId = notificationChannel.getId();

        Optional<NotificationTypeChannel> findTypeChannel = typeChannelRepository.findByNotificationTypeIdAndNotificationChannelId(notificationTypeId, notificationChannelId);

        if (findTypeChannel.isEmpty()) return null;

        NotificationTypeChannel typeChannel = findTypeChannel.get();

        if (!typeChannel.getIsActive()) return null;

        JSONObject shouldSend = new JSONObject();
        shouldSend.put("typeChannel", typeChannel);

        return shouldSend;
    }
}
