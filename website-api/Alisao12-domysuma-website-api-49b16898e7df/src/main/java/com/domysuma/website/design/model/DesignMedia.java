package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Auditable;
import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "design_media")
@Getter
@Setter
public class DesignMedia extends Auditable {
    private String alt;
    private String title;
    @Column(nullable = false)
    private String path;
    private Boolean isDefault = false;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DesignMediaType mediaType = DesignMediaType.IMAGE;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup = DesignMediaGroup.IMAGES;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_media_design"))
    @ToString.Exclude
    private Design design;
}
