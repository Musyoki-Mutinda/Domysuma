package com.domysuma.website.notification.model;

import com.domysuma.website.core.domain.Identifiable;
import com.domysuma.website.user.model.AdminUser;
import com.domysuma.website.user.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "admin_notifications")
@Getter
@Setter
@NoArgsConstructor
public class AdminNotification extends Identifiable {
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

    public AdminNotification(String message, String recipient, Integer status, String sourceTable, String sourceTableId) {
        this.message = message;
        this.recipient = recipient;
        this.status = status;
        this.sourceTable = sourceTable;
        this.sourceTableId = sourceTableId;
    }

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_admin_user", value = ConstraintMode.CONSTRAINT))
    private AdminUser user;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_notification_admin_channel", value = ConstraintMode.CONSTRAINT))
    private NotificationTypeChannel notificationTypeChannel;
}
