package com.domysuma.website.design.model;

import com.domysuma.website.core.domain.Auditable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "designs")
@Getter
@Setter
@SQLDelete(sql = "UPDATE designs SET status = false WHERE id=?")
@Where(clause = "status=1")
public class Design extends Auditable {
    private String title;
    @Column(unique = true, nullable = false)
    private String code;
    private String description;
    private Boolean status = false;
    @Column(unique = true)
    private String slug;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @ToString.Exclude
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_designs_default_image"), unique = true)
    private DesignMedia defaultImage;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_design_specs"))
    @ToString.Exclude
    private DesignSpec specs;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "design")
    @ToString.Exclude
    private List<DesignFeatureDetail> features;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "design")
    @ToString.Exclude
    private List<DesignMedia> media;
}
