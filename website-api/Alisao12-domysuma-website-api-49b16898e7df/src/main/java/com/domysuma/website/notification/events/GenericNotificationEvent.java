package com.domysuma.website.notification.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class GenericNotificationEvent<T> extends ApplicationEvent {
    private final Long actingUserId;
    private final String notificationType;
    private final T affectedObject;

    /**
     * This event class extends ApplicationEvent.
     * It can be raised at any point when an object is created, updated or deleted to trigger sending a notification.
     *
     * @param source - the object from which the event is raised (this)
     * @param affectedObject - The newly created, just updated or deleted object
     * @param actingUserId - The id of the currently authorized user
     * @param notificationType - e.g. USER_CREATED, available in NotificationTypeEnum
     * @author Alberto Isaboke
     * @since 2021-01-26
     */
    public GenericNotificationEvent(Object source, T affectedObject, Long actingUserId, String notificationType) {
        super(source);

        this.actingUserId = actingUserId;
        this.notificationType = notificationType;
        this.affectedObject = affectedObject;
    }
}
