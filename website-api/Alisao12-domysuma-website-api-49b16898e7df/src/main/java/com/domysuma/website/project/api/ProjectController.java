package com.domysuma.website.project.api;

import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.project.data.dto.request.ProjectCreate;
import com.domysuma.website.project.data.dto.request.ProjectMediaCreate;
import com.domysuma.website.project.data.dto.request.ProjectSearch;
import com.domysuma.website.project.data.dto.request.ProjectUpdate;
import com.domysuma.website.project.data.dto.response.ProjectResponse;
import com.domysuma.website.project.service.ProjectMediaService;
import com.domysuma.website.project.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Tag(name = "Projects")
@RestController
@RequestMapping(path = "api/project")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectMediaService projectMediaService;

    @PostMapping
    public ApiResponse createProject(@Valid @RequestBody ProjectCreate projectCreate) {
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
    public Pager<List<ProjectResponse>> findProjects(ProjectSearch projectSearch) {
        return projectService.findProjects(projectSearch);
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
}
