package com.domysuma.website.notification.data.dto;

import lombok.Data;

@Data
public class NotificationResponse {
    private Integer id;
    private String message;
    private String recipient;
    private String type;
    private String createdOn;
    private Integer status;
    private String label; //source table
    private String labelId; // source table id
}
