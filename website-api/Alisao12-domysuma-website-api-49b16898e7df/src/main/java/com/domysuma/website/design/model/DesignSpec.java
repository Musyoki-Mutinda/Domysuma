package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "design_specs")
@Getter
@Setter
public class DesignSpec extends Identifiable {
    private String bedrooms;
    private String bathrooms;
    private String storeys;
    private String area;
    private String width;
    private String length;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_specs_design"), unique = true)
    private Design design;
}
