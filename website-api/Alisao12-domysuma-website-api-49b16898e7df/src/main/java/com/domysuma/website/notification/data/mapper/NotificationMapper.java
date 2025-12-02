package com.domysuma.website.notification.data.mapper;

import com.domysuma.website.notification.data.dto.NotificationResponse;
import com.domysuma.website.notification.data.dto.NotificationTypeChannelResponse;
import com.domysuma.website.notification.data.dto.NotificationTypeResponse;
import com.domysuma.website.notification.model.Notification;
import com.domysuma.website.notification.model.NotificationType;
import com.domysuma.website.notification.model.NotificationTypeChannel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Collection;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {
    @Mapping(target = "type", source = "notificationTypeChannel.notificationType.name")
    @Mapping(target = "label", source = "sourceTable")
    @Mapping(target = "labelId", source = "sourceTableId")
    NotificationResponse notificationToDto(Notification notification);

    @Mapping(target = "type", source = "notificationTypeChannel.notificationType.name")
    @Mapping(target = "created_at", source = "createdAt")
    @Mapping(target = "label", source = "sourceTable")
    @Mapping(target = "labelId", source = "sourceTableId")
    Collection<NotificationResponse> notificationsToDtos(Collection<Notification> notifications);

    @Mapping(target = "channels", source = "typeChannel")
    NotificationTypeResponse notificationTypeToDto(NotificationType notificationType);

    @Mapping(target = "typeId", source = "notificationType.id")
    @Mapping(target = "channelId", source = "notificationChannel.id")
    NotificationTypeChannelResponse notificationTypeChannelToDto(NotificationTypeChannel notificationTypeChannel);
}
