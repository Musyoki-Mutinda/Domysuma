package com.domysuma.website.app.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "design_features")
@Getter
@Setter
public class DesignFeature extends Identifiable {
    @Column(unique = true)
    private String title;
    // If it is main it will appear beside the images slide on the design idea detail page - multiple isMain supported.
    private Boolean isMain = false;
}
