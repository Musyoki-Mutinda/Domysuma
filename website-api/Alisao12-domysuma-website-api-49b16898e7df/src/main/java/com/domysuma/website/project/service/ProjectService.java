package com.domysuma.website.project.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.core.util.PaginationUtil;
import com.domysuma.website.project.data.ProjectSpecification;
import com.domysuma.website.project.data.dto.request.ProjectCreate;
import com.domysuma.website.project.data.dto.request.ProjectSearch;
import com.domysuma.website.project.data.dto.request.ProjectUpdate;
import com.domysuma.website.project.data.dto.response.ProjectCreatedResponse;
import com.domysuma.website.project.data.dto.response.ProjectResponse;
import com.domysuma.website.project.data.mapper.ProjectMapper;
import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.repository.ProjectRepo;
import com.domysuma.website.project.repository.ProjectSpecRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {
    private final ProjectRepo projectRepo;
    private final ProjectSpecRepo projectSpecRepo;

    private final ProjectMapper projectMapper;

    private final ProjectDetailsService projectDetailsService;
    private final ProjectMediaService projectMediaService;

    public ProjectCreatedResponse createProject(ProjectCreate projectCreate) {
        var project = projectMapper.toProjectModel(projectCreate);
        var specs = projectDetailsService.createProjectSpecs(projectCreate.getSpecs());

        project.setSpecs(specs);
        var newProject = projectRepo.save(project);

        specs.setProject(newProject);
        projectSpecRepo.save(specs);

        projectMediaService.createProjectMedia(newProject, projectCreate.getMedia());

        return projectMapper.toProjectCreatedResponse(newProject);
    }

    public void updateProject(Long projectId, ProjectUpdate projectUpdate) {
        var project = findProjectByIdOrThrow(projectId);
        projectMapper.updateToProjectModel(projectUpdate, project);
        projectRepo.save(project);

        projectDetailsService.updateProjectSpecs(project, projectUpdate.getSpecs());
    }

    public ProjectResponse findProject(Long projectId) {
        var project = findProjectByIdOrThrow(projectId);
        return projectMapper.toProjectResponse(project);
    }

    public Pager<List<ProjectResponse>> findProjects(ProjectSearch search) {
        var spec = ProjectSpecification.createSpecification(search);
        var pageRequest = search.getSortedPageRequest("id");
        var projectPage = projectRepo.findAll(spec, pageRequest);

        var pager = PaginationUtil.toPager(projectPage, "Projects");
        var responses = projectMapper.toProjectResponses(projectPage.getContent());
        pager.setData(responses);

        return pager;
    }

    public Project findProjectByIdOrThrow(Long projectId) {
        return projectRepo.findById(projectId).orElseThrow(() -> APIException.notFound("Project with ID: {0} not found."));
    }
}
