package com.domysuma.website.notification.listeners;

import com.domysuma.website.notification.events.EmailAdminNotificationEvent;
import com.domysuma.website.notification.events.EmailNotificationEvent;
import com.domysuma.website.notification.model.AdminNotification;
import com.domysuma.website.notification.model.Notification;
import com.domysuma.website.notification.model.NotificationTypeChannel;
import com.domysuma.website.notification.repositories.NotificationChannelRepository;
import com.domysuma.website.notification.repositories.NotificationTypeChannelRepository;
import com.domysuma.website.notification.repositories.NotificationTypeRepository;
import com.domysuma.website.notification.service.AdminNotificationService;
import com.domysuma.website.notification.service.EmailAdminNotificationService;
import com.domysuma.website.notification.service.EmailNotificationService;
import com.domysuma.website.notification.service.NotificationService;
import org.json.JSONObject;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailAdminNotificationListener {
    final NotificationTypeRepository typeRepository;
    final NotificationChannelRepository channelRepository;
    final NotificationTypeChannelRepository typeChannelRepository;
    final AdminNotificationService notificationService;
    final EmailAdminNotificationService emailNotificationService;
    final NotificationListenerHelper notificationListenerHelper;

    public EmailAdminNotificationListener(
            NotificationTypeRepository typeRepository,
            NotificationChannelRepository channelRepository,
            NotificationTypeChannelRepository typeChannelRepository,
            AdminNotificationService notificationService,
            EmailAdminNotificationService emailNotificationService, NotificationListenerHelper notificationListenerHelper) {
        this.typeRepository = typeRepository;
        this.channelRepository = channelRepository;
        this.typeChannelRepository = typeChannelRepository;
        this.notificationService = notificationService;
        this.emailNotificationService = emailNotificationService;
        this.notificationListenerHelper = notificationListenerHelper;
    }

    @EventListener
    @Async("threadPoolTaskExecutor")
    public void send(EmailAdminNotificationEvent event) {
        JSONObject shouldSend = notificationListenerHelper.shouldSend(event.getType(), "email");
        if (shouldSend != null) {
            AdminNotification notification = new AdminNotification(event.getMessage(), event.getRecipient(), 1, event.getSourceTable(), event.getSourceTableId());
            NotificationTypeChannel typeChannel = (NotificationTypeChannel) shouldSend.get("typeChannel");
            notification.setNotificationTypeChannel(typeChannel);
            notification.setUser(event.getUserToNotify());
            emailNotificationService.sendHtmlEmail(event, notification);
        }
    }
}
