package com.domysuma.website.notification.data.dto;

import lombok.Data;

@Data
public class NotificationTypeChannelResponse {
    private Integer id;
    private Boolean isActive;
    private Integer typeId;
    private Integer channelId;
}
