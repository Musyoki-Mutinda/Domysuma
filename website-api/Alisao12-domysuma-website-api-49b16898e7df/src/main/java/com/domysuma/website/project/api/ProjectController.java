package com.domysuma.website.project.api;

import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.core.util.FileUtil;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import com.domysuma.website.project.data.dto.request.ProjectCreate;
import com.domysuma.website.project.data.dto.request.ProjectMediaCreate;
import com.domysuma.website.project.data.dto.request.ProjectSearch;
import com.domysuma.website.project.data.dto.request.ProjectUpdate;
import com.domysuma.website.project.data.dto.response.ProjectResponse;
import com.domysuma.website.project.service.ProjectMediaService;
import com.domysuma.website.project.service.ProjectService;
import com.domysuma.website.user.model.User;
import com.domysuma.website.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Tag(name = "Projects")
@RestController
@RequestMapping(path = "api/project")
@CrossOrigin(origins = {"https://domysumaarchitects.co.ke", "https://admin.domysumaarchitects.co.ke", "http://localhost:4200", "http://localhost:4300"}, allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequiredArgsConstructor
@Slf4j
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectMediaService projectMediaService;
    private final UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse createProject(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam String category,
            @RequestParam(required = false) String yearCompleted,
            @RequestParam(required = false) String client,
            @RequestParam(required = false) String scope,
            @RequestParam(required = false) String county,
            @RequestParam(required = false) String totalFloorArea,
            @RequestParam(required = false) String structuralSystem,
            @RequestParam(required = false) String interiorFeatures,
            @RequestParam(required = false) String longDescription,
            @RequestParam(required = false) String designer,
            @RequestParam(required = false) List<MultipartFile> galleryImages,
            @RequestParam(required = false) List<MultipartFile> architecturalDrawings
    ) {
        // Create project data object
        ProjectCreate projectCreate = new ProjectCreate();
        projectCreate.setTitle(title);
        projectCreate.setDescription(description);
        projectCreate.setLocation(location);
        projectCreate.setCategory(category);
        if (yearCompleted != null) {
            projectCreate.setYear(yearCompleted); // Note: using 'year' field
        }
        if (client != null) {
            projectCreate.setClient(client);
        }
        if (scope != null && !scope.isEmpty()) {
            projectCreate.setScope(scope); // Store scope as JSON string
        }
        if (county != null) {
            projectCreate.setCounty(county);
        }
        if (totalFloorArea != null) {
            projectCreate.setTotalFloorArea(totalFloorArea);
        }
        if (structuralSystem != null) {
            projectCreate.setStructuralSystem(structuralSystem);
        }
        if (interiorFeatures != null) {
            projectCreate.setInteriorFeatures(interiorFeatures);
        }
        if (longDescription != null) {
            projectCreate.setLongDescription(longDescription);
        }
        if (designer != null) {
            projectCreate.setDesigner(designer);
        }

        // Handle file uploads
        var mediaCreates = new java.util.ArrayList<ProjectMediaCreate>();

        // Process gallery images
        if (galleryImages != null && !galleryImages.isEmpty()) {
            for (MultipartFile file : galleryImages) {
                try {
                    String base64 = FileUtil.multipartToBase64(file);
                    var mediaCreate = new ProjectMediaCreate();
                    mediaCreate.setEncodedFile(base64);
                    mediaCreate.setMediaType(DesignMediaType.IMAGE);
                    mediaCreate.setMediaGroup(DesignMediaGroup.IMAGES);
                    mediaCreate.setTitle(file.getOriginalFilename());
                    mediaCreate.setAlt(file.getOriginalFilename());
                    mediaCreate.setIsDefault(mediaCreates.isEmpty()); // First image is default
                    mediaCreates.add(mediaCreate);
                } catch (Exception e) {
                    log.error("Error processing gallery image: " + file.getOriginalFilename(), e);
                }
            }
        }

        // Process architectural drawings
        if (architecturalDrawings != null && !architecturalDrawings.isEmpty()) {
            for (MultipartFile file : architecturalDrawings) {
                try {
                    String base64 = FileUtil.multipartToBase64(file);
                    var mediaCreate = new ProjectMediaCreate();
                    mediaCreate.setEncodedFile(base64);
                    mediaCreate.setMediaType(file.getContentType().startsWith("image/") ? DesignMediaType.IMAGE : DesignMediaType.DOCUMENT);
                    mediaCreate.setMediaGroup(DesignMediaGroup.ARCHITECTURAL_DRAWINGS);
                    mediaCreate.setTitle(file.getOriginalFilename());
                    mediaCreate.setAlt(file.getOriginalFilename());
                    mediaCreate.setIsDefault(false);
                    mediaCreates.add(mediaCreate);
                } catch (Exception e) {
                    log.error("Error processing architectural drawing: " + file.getOriginalFilename(), e);
                }
            }
        }

        projectCreate.setMedia(mediaCreates);

        return ApiResponse.ok(projectService.createProject(projectCreate));
    }

    @PutMapping("{projectId}")
    public ApiResponse updateProject(@PathVariable Long projectId, @RequestBody ProjectUpdate projectUpdate) {
        projectService.updateProject(projectId, projectUpdate);
        return ApiResponse.ok("Project updated");
    }

    @GetMapping("{projectId}")
    public ApiResponse findProject(@PathVariable Long projectId) {
        return ApiResponse.ok(projectService.findProject(projectId));
    }

    @GetMapping
    public ApiResponse getPublishedProjects() {
        try {
            var projects = projectService.findPublishedProjects();
            return ApiResponse.ok(projects);
        } catch (Exception e) {
            log.error("Error fetching published projects: ", e);
            return ApiResponse.errorMessage("Failed to fetch projects: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    // Toggle project visibility (publish/unpublish)
    @PatchMapping("/{id}/toggle-visibility")
    public ApiResponse toggleProjectVisibility(@PathVariable Long id) {
        try {
            var project = projectService.findProjectById(id);
            if (project == null) {
                return ApiResponse.errorMessage("Project not found with id: " + id, HttpStatus.NOT_FOUND, null);
            }

            // Toggle the published status
            project.setPublished(!project.getPublished());
            projectService.saveProject(project);

            String status = project.getPublished() ? "published" : "hidden";
            log.info("Project {} is now {}", id, status);

            return ApiResponse.ok(Map.of(
                "status", 200,
                "message", "Project " + status + " successfully",
                "success", true,
                "data", Map.of(
                    "id", project.getId(),
                    "published", project.getPublished()
                )
            ));

        } catch (Exception e) {
            log.error("Error toggling project visibility: ", e);
            return ApiResponse.errorMessage("Failed to toggle visibility: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    // Get all projects (for admin - shows both published and hidden)
    @GetMapping("/admin/all")
    public ApiResponse getAllProjectsAdmin() {
        try {
            var projects = projectService.findAllProjects();
            return ApiResponse.ok(projects);
        } catch (Exception e) {
            log.error("Error fetching all projects for admin: ", e);
            return ApiResponse.errorMessage("Failed to fetch projects: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }


    @PostMapping("{projectId}/add-media")
    public ApiResponse addDesignMedia(@PathVariable Long projectId, @Valid @RequestBody List<ProjectMediaCreate> mediaCreate) {
        projectMediaService.addProjectMedia(projectId, mediaCreate);
        return ApiResponse.ok("Project media added");
    }

    @DeleteMapping("media/{projectMediaId}")
    public ApiResponse removeProjectMedia(@PathVariable Long projectMediaId) {
        projectMediaService.removeProjectMedia(projectMediaId);
        return ApiResponse.ok("Design media removed");
    }

    @PutMapping("media/{projectMediaId}/make-default")
    public ApiResponse makeProjectMediaDefault(@PathVariable Long projectMediaId) {
        projectMediaService.makeProjectMediaDefault(projectMediaId);
        return ApiResponse.ok("Design media set as default");
    }

    @DeleteMapping("{projectId}")
    public ApiResponse deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ApiResponse.ok("Project deleted");
    }

    @PostMapping("{projectId}/save")
    public ApiResponse saveProject(@PathVariable Long projectId) {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ApiResponse.errorMessage("User not authenticated", HttpStatus.UNAUTHORIZED, null);
            }
            projectService.saveProjectForUser(currentUser, projectId);
            return ApiResponse.ok("Project saved successfully");
        } catch (Exception e) {
            log.error("Error saving project: ", e);
            return ApiResponse.errorMessage("Failed to save project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @DeleteMapping("{projectId}/save")
    public ApiResponse unsaveProject(@PathVariable Long projectId) {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ApiResponse.errorMessage("User not authenticated", HttpStatus.UNAUTHORIZED, null);
            }
            projectService.unsaveProjectForUser(currentUser, projectId);
            return ApiResponse.ok("Project unsaved successfully");
        } catch (Exception e) {
            log.error("Error unsaving project: ", e);
            return ApiResponse.errorMessage("Failed to unsave project: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("{projectId}/is-saved")
    public ApiResponse isProjectSaved(@PathVariable Long projectId) {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ApiResponse.ok(Map.of("isSaved", false));
            }
            boolean isSaved = projectService.isProjectSavedByUser(currentUser, projectId);
            return ApiResponse.ok(Map.of("isSaved", isSaved));
        } catch (Exception e) {
            log.error("Error checking if project is saved: ", e);
            return ApiResponse.errorMessage("Failed to check saved status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/saved")
    public ApiResponse getSavedProjects() {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ApiResponse.errorMessage("User not authenticated", HttpStatus.UNAUTHORIZED, null);
            }
            var savedProjects = projectService.findSavedProjectsByUser(currentUser);
            return ApiResponse.ok(savedProjects);
        } catch (Exception e) {
            log.error("Error fetching saved projects: ", e);
            return ApiResponse.errorMessage("Failed to fetch saved projects: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}
