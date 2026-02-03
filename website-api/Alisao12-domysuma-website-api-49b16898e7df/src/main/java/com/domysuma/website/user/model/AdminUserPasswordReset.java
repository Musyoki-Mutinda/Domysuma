package com.domysuma.website.user.model;

import com.domysuma.website.core.domain.Identifiable;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_user_password_reset")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
@EntityListeners(AuditingEntityListener.class)
public class AdminUserPasswordReset extends Identifiable {
    @Version
    private Long version = 1L;
    @CreatedDate
    private Instant createdOn;
    @LastModifiedDate
    private Instant lastModifiedOn;
    private LocalDateTime expiry;
    private String token;
    private String resetToken;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_admin_user_password_reset_admin_user"), unique = true)
    private AdminUser user;
}
