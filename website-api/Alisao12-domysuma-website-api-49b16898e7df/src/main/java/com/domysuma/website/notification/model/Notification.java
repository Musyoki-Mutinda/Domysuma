package com.domysuma.website.notification.model;

import com.domysuma.website.core.domain.Identifiable;
import com.domysuma.website.user.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification extends Identifiable {
    @Column(columnDefinition = "TEXT")
    private String message;
    private String recipient;
    private Integer status;
    private String sourceTable;
    private String sourceTableId;
    @Version
    private Long version = 1L;
    @CreatedDate
    protected Instant createdOn;
    @LastModifiedDate
    protected Instant lastModifiedOn;

    public Notification(String message, String recipient, Integer status, String sourceTable, String sourceTableId) {
        this.message = message;
        this.recipient = recipient;
        this.status = status;
        this.sourceTable = sourceTable;
        this.sourceTableId = sourceTableId;
    }

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_user", value = ConstraintMode.CONSTRAINT))
    private User user;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_channel", value = ConstraintMode.CONSTRAINT))
    private NotificationTypeChannel notificationTypeChannel;
}
