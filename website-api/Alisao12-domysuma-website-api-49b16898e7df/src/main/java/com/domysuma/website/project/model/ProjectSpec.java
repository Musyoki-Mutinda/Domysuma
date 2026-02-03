package com.domysuma.website.project.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "project_specs")
@Getter
@Setter
public class ProjectSpec extends Identifiable {

    private String bedrooms;
    private String bathrooms;
    private String storeys;
    private String area;
    private String width;
    private String length;

    @OneToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_project_specs_project"))
    private Project project;
}
