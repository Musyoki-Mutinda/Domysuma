package com.domysuma.website.project.repository;

import com.domysuma.website.project.model.ProjectSpec;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectSpecRepo extends JpaRepository<ProjectSpec, Long> {
}
