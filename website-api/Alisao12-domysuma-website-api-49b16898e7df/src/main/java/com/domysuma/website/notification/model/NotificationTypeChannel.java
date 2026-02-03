package com.domysuma.website.notification.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "notification_type_channels")
@Getter
@Setter
public class NotificationTypeChannel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean isActive = true;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_tc_type", value = ConstraintMode.CONSTRAINT))
    private NotificationType notificationType;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_tc_channel", value = ConstraintMode.CONSTRAINT))
    private NotificationChannel notificationChannel;
}
