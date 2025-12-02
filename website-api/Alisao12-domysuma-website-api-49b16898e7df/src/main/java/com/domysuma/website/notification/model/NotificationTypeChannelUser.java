package com.domysuma.website.notification.model;

import com.domysuma.website.user.model.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class NotificationTypeChannelUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean isActive;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_tcu_user", value = ConstraintMode.CONSTRAINT))
    private User user;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_tcu_type_channel", value = ConstraintMode.CONSTRAINT))
    private NotificationTypeChannel notificationTypeChannel;
}
