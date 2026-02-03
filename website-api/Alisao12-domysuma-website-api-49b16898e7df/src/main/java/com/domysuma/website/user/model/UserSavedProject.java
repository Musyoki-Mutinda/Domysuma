package com.domysuma.website.user.model;

import com.domysuma.website.core.domain.Auditable;
import com.domysuma.website.project.model.Project;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "user_saved_projects")
@Getter
@Setter
public class UserSavedProject extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_user_saved_projects_user"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_user_saved_projects_project"))
    private Project project;

    @Column(nullable = false)
    private Boolean active = true;
}