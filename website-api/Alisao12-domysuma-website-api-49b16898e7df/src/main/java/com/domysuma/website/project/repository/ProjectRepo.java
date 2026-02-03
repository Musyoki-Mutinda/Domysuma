package com.domysuma.website.project.repository;

import com.domysuma.website.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

    // Find only published projects
    List<Project> findByPublished(Boolean published);

    // Find by category and published status
    List<Project> findByCategoryAndPublished(String category, Boolean published);
}
