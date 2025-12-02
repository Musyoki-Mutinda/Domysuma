package com.domysuma.website.project.repository;

import com.domysuma.website.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProjectRepo extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
}
