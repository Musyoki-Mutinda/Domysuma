package com.domysuma.website.notification.service;

import com.domysuma.website.auth.service.AuthService;
import com.domysuma.website.notification.data.dto.*;
import com.domysuma.website.notification.data.mapper.NotificationChannelMapper;
import com.domysuma.website.notification.data.mapper.NotificationMapper;
import com.domysuma.website.notification.data.mapper.NotificationTypeMapper;
import com.domysuma.website.notification.model.Notification;
import com.domysuma.website.notification.model.NotificationChannel;
import com.domysuma.website.notification.model.NotificationType;
import com.domysuma.website.notification.model.NotificationTypeChannel;
import com.domysuma.website.notification.repositories.NotificationChannelRepository;
import com.domysuma.website.notification.repositories.NotificationRepository;
import com.domysuma.website.notification.repositories.NotificationTypeChannelRepository;
import com.domysuma.website.notification.repositories.NotificationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationTypeRepository notificationTypeRepository;
    private final NotificationChannelRepository notificationChannelRepository;
    private final NotificationTypeChannelRepository notificationTypeChannelRepository;
    private final NotificationMapper notificationMapper;
    private final AuthService authService;
    private final NotificationChannelMapper notificationChannelMapper;
    private final NotificationTypeMapper notificationTypeMapper;


    public Collection<NotificationResponse> fetchUserWebNotifications(Long userId) {
        NotificationChannel notificationChannel = notificationChannelRepository
                .findByName("web")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found: web"));
        Collection<NotificationTypeChannel> notificationTypeChannels = notificationTypeChannelRepository.findByNotificationChannelId(notificationChannel.getId());
        List<Long> notificationTypeChannelIds = notificationTypeChannels.stream().map(NotificationTypeChannel::getId).collect(Collectors.toList());
        Collection<Notification> notifications = notificationRepository.findTop10ByNotificationTypeChannelIdInAndUserIdOrderByCreatedOnDesc(notificationTypeChannelIds, userId);
        return notificationMapper.notificationsToDtos(notifications);
    }

    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification entry not found"));

        if (!notification.getUser().getId().equals(authService.getMe().getId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not allowed to do that");
        }

        if (notification.getStatus() != 0) {
            return notificationMapper.notificationToDto(notification);
        }

        notification.setStatus(1);
        Notification updatedNotification = notificationRepository.save(notification);
        return notificationMapper.notificationToDto(updatedNotification);
    }

    public NotificationTypeResponse addType(NotificationTypeCreate create) {
        var notificationType = notificationTypeMapper.createToModel(create);
        NotificationType savedNotificationType = notificationTypeRepository.save(notificationType);
        savedNotificationType.setIsActive(true);
        return notificationMapper.notificationTypeToDto(savedNotificationType);
    }

    public List<NotificationTypeResponse> getTypes() {
        List<NotificationType> notificationTypes = notificationTypeRepository.findAll();
        List<NotificationTypeResponse> typeDtos = new ArrayList<>();
        notificationTypes.forEach(notificationType -> typeDtos.add(notificationMapper.notificationTypeToDto(notificationType)));
        return typeDtos;
    }

    public NotificationChannel addChannel(NotificationChannelCreate create) {
        var notificationChannel = notificationChannelMapper.createToModel(create);
        return notificationChannelRepository.save(notificationChannel);
    }

    public List<NotificationChannel> getChannels() {
        return notificationChannelRepository.findAll();
    }

    public NotificationTypeChannelResponse addTypeChannel(NotificationTypeChannelCreate typeChannelDto) {
        NotificationType notificationType = notificationTypeRepository
                .findById(typeChannelDto.getTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Notification type not found"));
        NotificationChannel notificationChannel = notificationChannelRepository
                .findById(typeChannelDto.getChannelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Channel not found"));

        NotificationTypeChannel notificationTypeChannel = new NotificationTypeChannel();
        notificationTypeChannel.setNotificationType(notificationType);
        notificationTypeChannel.setNotificationChannel(notificationChannel);
        NotificationTypeChannel saved = notificationTypeChannelRepository.save(notificationTypeChannel);
        saved.setIsActive(true);
        return notificationMapper.notificationTypeChannelToDto(saved);
    }

    public List<NotificationTypeChannelResponse> getTypeChannels() {
        List<NotificationTypeChannelResponse> typeChannelDtos = new ArrayList<>();
        List<NotificationTypeChannel> typeChannels = notificationTypeChannelRepository.findAll();
        typeChannels.forEach((typeChannel) -> typeChannelDtos.add(notificationMapper.notificationTypeChannelToDto(typeChannel)));
        return typeChannelDtos;
    }

    public NotificationTypeChannelResponse updateTypeChannelStatus(Long typeChannelId, NotificationTypeChannelUpdate updateDto) {
        NotificationTypeChannel typeChannel = notificationTypeChannelRepository
                .findById(typeChannelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type Channel Not Found"));
        typeChannel.setIsActive(updateDto.getIsActive());
        return notificationMapper.notificationTypeChannelToDto(notificationTypeChannelRepository.save(typeChannel));
    }

    public void addSentNotification(Notification notification) {
        notificationRepository.save(notification);
    }
}
