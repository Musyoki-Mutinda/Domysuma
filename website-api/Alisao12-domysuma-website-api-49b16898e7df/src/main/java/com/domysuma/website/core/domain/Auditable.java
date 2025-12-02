package com.domysuma.website.core.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import java.time.Instant;
import java.util.Objects;

/**
 * Audit Model
 */

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable extends Identifiable {

    @Version
    private Long version = 1L;
    @CreatedBy
    private String createdBy;
    @CreatedDate
    protected Instant createdOn;
    @LastModifiedBy
    private String lastModifiedBy;
    @LastModifiedDate
    protected Instant lastModifiedOn;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Auditable auditable = (Auditable) o;
        return getId() != null && Objects.equals(getId(), auditable.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
