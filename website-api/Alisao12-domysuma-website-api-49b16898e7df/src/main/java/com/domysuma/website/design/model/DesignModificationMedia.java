package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Identifiable;
import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "design_modification_media")
@Getter
@Setter
public class DesignModificationMedia extends Identifiable {
    private String alt;
    private String title;
    private String path;
    private Boolean isDefault;
    @Enumerated(EnumType.STRING)
    private DesignMediaType type;
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_modification_media_modification"))
    @ToString.Exclude
    private DesignModification designModification;
}
