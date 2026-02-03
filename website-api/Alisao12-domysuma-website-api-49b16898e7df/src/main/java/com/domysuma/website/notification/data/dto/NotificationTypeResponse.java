package com.domysuma.website.notification.data.dto;

import lombok.Data;

import java.util.Collection;

@Data
public class NotificationTypeResponse {
    private Integer id;
    private String name;
    private String description;
    private Boolean isActive;
    private Collection<NotificationTypeChannelResponse> channels;
}
