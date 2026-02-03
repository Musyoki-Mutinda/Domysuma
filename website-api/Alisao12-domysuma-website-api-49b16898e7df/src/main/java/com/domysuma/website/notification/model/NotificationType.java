package com.domysuma.website.notification.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@Table(name = "notification_type")
public class NotificationType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Boolean isActive = true;
    @OneToMany(mappedBy = "notificationType", fetch = FetchType.EAGER)
    private Collection<NotificationTypeChannel> typeChannel;
}
