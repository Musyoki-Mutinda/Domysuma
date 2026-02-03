package com.domysuma.website.design.model;

import com.domysuma.website.app.model.DesignFeature;
import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "design_feature_details")
@Getter
@Setter
public class DesignFeatureDetail extends Identifiable {
    private String detail;

    @ManyToOne
    private DesignFeature designFeature;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_feature_details_design", value = ConstraintMode.CONSTRAINT))
    private Design design;
}
