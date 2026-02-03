package com.domysuma.website.project.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.core.util.PaginationUtil;
import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.project.data.ProjectSpecification;
import com.domysuma.website.project.data.dto.request.ProjectCreate;
import com.domysuma.website.project.data.dto.request.ProjectSearch;
import com.domysuma.website.project.data.dto.request.ProjectUpdate;
import com.domysuma.website.project.data.dto.response.ProjectCreatedResponse;
import com.domysuma.website.project.data.dto.response.ProjectMediaResponse;
import com.domysuma.website.project.data.dto.response.ProjectResponse;
import com.domysuma.website.project.data.mapper.ProjectMapper;
import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.model.ProjectMedia;
import com.domysuma.website.project.repository.ProjectRepo;
import com.domysuma.website.project.repository.ProjectSpecRepo;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.model.UserSavedProject;
import com.domysuma.website.user.repository.UserSavedProjectRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {
    private final ProjectRepo projectRepo;
    private final ProjectSpecRepo projectSpecRepo;
    private final UserSavedProjectRepo userSavedProjectRepo;

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
        // Explicitly load media to ensure it's available for mapping
        if (project.getMedia() != null) {
            project.getMedia().size(); // This triggers lazy loading
        }

        var response = projectMapper.toProjectResponse(project);

        // Populate separate media fields for frontend compatibility
        if (project.getMedia() != null && !project.getMedia().isEmpty()) {
            var galleryImages = project.getMedia().stream()
                .filter(media -> DesignMediaGroup.IMAGES.equals(media.getMediaGroup()) ||
                                DesignMediaGroup.GALLERY.equals(media.getMediaGroup()))
                .map(projectMapper::toProjectMediaResponse)
                .collect(Collectors.toList());

            var architecturalDrawings = project.getMedia().stream()
                .filter(media -> DesignMediaGroup.ARCHITECTURAL_DRAWINGS.equals(media.getMediaGroup()) ||
                                DesignMediaGroup.FLOOR_PLANS.equals(media.getMediaGroup()))
                .map(projectMapper::toProjectMediaResponse)
                .collect(Collectors.toList());

            response.setGalleryImages(galleryImages);
            response.setArchitecturalDrawings(architecturalDrawings);
        }

        return response;
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

    public void deleteProject(Long projectId) {
        var project = findProjectByIdOrThrow(projectId);
        projectRepo.delete(project);
    }

    public Project findProjectByIdOrThrow(Long projectId) {
        return projectRepo.findById(projectId).orElseThrow(() -> APIException.notFound("Project with ID: {0} not found."));
    }

    public Project findProjectById(Long projectId) {
        return projectRepo.findById(projectId).orElse(null);
    }

    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    public List<ProjectResponse> findAllProjects() {
        var projects = projectRepo.findAll();
        return projects.stream()
            .map(this::mapToProjectResponse)
            .collect(Collectors.toList());
    }

    public List<ProjectResponse> findPublishedProjects() {
        var projects = projectRepo.findByPublished(true);
        return projects.stream()
            .map(this::mapToProjectResponse)
            .collect(Collectors.toList());
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        // Explicitly load lazy relationships
        if (project.getMedia() != null) {
            project.getMedia().size(); // Trigger lazy loading
        }
        if (project.getSpecs() != null) {
            // Access a field to trigger lazy loading
            project.getSpecs().getBedrooms();
        }

        var response = projectMapper.toProjectResponse(project);

        // Populate separate media fields for frontend compatibility
        if (project.getMedia() != null && !project.getMedia().isEmpty()) {
            var galleryImages = project.getMedia().stream()
                .filter(media -> DesignMediaGroup.IMAGES.equals(media.getMediaGroup()) ||
                                DesignMediaGroup.GALLERY.equals(media.getMediaGroup()))
                .map(projectMapper::toProjectMediaResponse)
                .collect(Collectors.toList());

            var architecturalDrawings = project.getMedia().stream()
                .filter(media -> DesignMediaGroup.ARCHITECTURAL_DRAWINGS.equals(media.getMediaGroup()) ||
                                DesignMediaGroup.FLOOR_PLANS.equals(media.getMediaGroup()))
                .map(projectMapper::toProjectMediaResponse)
                .collect(Collectors.toList());

            response.setGalleryImages(galleryImages);
            response.setArchitecturalDrawings(architecturalDrawings);
        }

        return response;
    }

    public void saveProjectForUser(User user, Long projectId) {
        var project = findProjectByIdOrThrow(projectId);
        var existing = userSavedProjectRepo.findByUserAndProjectAndActive(user, project, true);
        if (existing.isEmpty()) {
            var savedProject = new UserSavedProject();
            savedProject.setUser(user);
            savedProject.setProject(project);
            savedProject.setActive(true);
            userSavedProjectRepo.save(savedProject);
        }
    }

    public void unsaveProjectForUser(User user, Long projectId) {
        var project = findProjectByIdOrThrow(projectId);
        var existing = userSavedProjectRepo.findByUserAndProjectAndActive(user, project, true);
        existing.ifPresent(savedProject -> {
            savedProject.setActive(false);
            userSavedProjectRepo.save(savedProject);
        });
    }

    public boolean isProjectSavedByUser(User user, Long projectId) {
        var project = findProjectByIdOrThrow(projectId);
        return userSavedProjectRepo.existsByUserAndProjectAndActive(user, project, true);
    }

    public List<ProjectResponse> findSavedProjectsByUser(User user) {
        var savedProjects = userSavedProjectRepo.findActiveSavedProjectsByUser(user);
        return savedProjects.stream()
            .map(UserSavedProject::getProject)
            .map(this::mapToProjectResponse)
            .collect(Collectors.toList());
    }
}
