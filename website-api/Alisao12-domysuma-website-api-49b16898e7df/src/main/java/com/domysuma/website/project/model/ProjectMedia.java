package com.domysuma.website.project.model;

import com.domysuma.website.core.domain.Auditable;
import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "project_media")
@Getter
@Setter
public class ProjectMedia extends Auditable {

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
    private DesignMediaGroup mediaGroup = DesignMediaGroup.GALLERY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_media_project"))
    @ToString.Exclude
    private Project project;
}
