package com.domysuma.website.app.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "app_regions")
@Getter
@Setter
public class Region extends Identifiable {
    private String name;
    private String description;

    public Region(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Region() {}
}
