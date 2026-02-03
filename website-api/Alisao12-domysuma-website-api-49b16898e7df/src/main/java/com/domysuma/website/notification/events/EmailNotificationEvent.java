package com.domysuma.website.notification.events;

import com.domysuma.website.user.model.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class EmailNotificationEvent extends ApplicationEvent {
    private final String type;
    private final String message;
    private final String recipient;
    private final String subject;
    private final User userToNotify;
    private final String sourceTable;
    private final String sourceTableId;

    public EmailNotificationEvent(Object source, String type, String message, String recipient, String subject, User userToNotify, String sourceTable, String sourceTableId) {
        super(source);
        this.type = type;
        this.message = message;
        this.recipient = recipient;
        this.subject = subject;
        this.userToNotify = userToNotify;
        this.sourceTable = sourceTable;
        this.sourceTableId = sourceTableId;
    }
}
