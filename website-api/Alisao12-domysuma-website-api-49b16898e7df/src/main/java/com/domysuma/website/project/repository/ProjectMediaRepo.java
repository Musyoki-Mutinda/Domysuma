package com.domysuma.website.project.repository;

import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.model.ProjectMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMediaRepo extends JpaRepository<ProjectMedia, Long> {
    List<ProjectMedia> findAllByProjectAndIdNot(Project project, Long newDefaultId);
}
