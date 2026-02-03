package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Identifiable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "design_modifications")
@Getter
@Setter
public class DesignModification extends Identifiable {
    private String name;
    private String email;
    private String phone;
    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_modifications_design"))
    @ToString.Exclude
    private Design design;
}
