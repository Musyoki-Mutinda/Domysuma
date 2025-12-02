package com.domysuma.website.project.service;

import com.domysuma.website.project.data.dto.request.ProjectSpecCreate;
import com.domysuma.website.project.data.mapper.ProjectSpecMapper;
import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.model.ProjectSpec;
import com.domysuma.website.project.repository.ProjectSpecRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectDetailsService {
    private final ProjectSpecRepo projectSpecRepo;

    private final ProjectSpecMapper projectSpecMapper;

    public ProjectSpec createProjectSpecs(ProjectSpecCreate specCreate) {
        if (specCreate == null) {
            return new ProjectSpec();
        }
        var projectSpec = projectSpecMapper.toEntity(specCreate);
        return projectSpecRepo.save(projectSpec);
    }

    public void updateProjectSpecs(Project project, ProjectSpecCreate specUpdate) {
        if (specUpdate == null) {
            return;
        }

        var specs = project.getSpecs();
        projectSpecMapper.updateToProjectSpecModel(specUpdate, specs);
        projectSpecRepo.save(specs);
    }
}
