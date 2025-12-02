package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "design_categories")
@Getter
@Setter
public class DesignCategory extends Identifiable {
    private String name;
    private String description;
}
