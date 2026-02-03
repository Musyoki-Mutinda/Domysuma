package com.domysuma.website.project.model;

import com.domysuma.website.core.domain.Auditable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
public class Project extends Auditable {

    private String title;

    @Column(length = 2000)
    private String briefDescription;

    @Column(length = 5000)
    private String longDescription;

    private String category;
    private String county;
    private String location;

    private String totalFloorArea;
    private String structuralSystem;

    @Column(length = 2000)
    private String interiorFeatures;

    private String yearCompleted;
    private String year; // Alias for yearCompleted to match frontend
    private String designer;
    private String clientType; // Alias for client to match frontend

    @Column(length = 1000)
    private String scope; // JSON array of scope items

    @Column(unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean published = true; // or "visible"

    // Optional fields from old structure (keep if used elsewhere)
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;

    // Default thumbnail
    @OneToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_projects_default_image"), unique = true)
    private ProjectMedia defaultImage;

    // Project specifications (bedrooms, bathrooms, etc.)
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_project_specs"))
    @ToString.Exclude
    private ProjectSpec specs;

    // All media (gallery, drawings, floor plans, etc.)
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<ProjectMedia> media;
}
