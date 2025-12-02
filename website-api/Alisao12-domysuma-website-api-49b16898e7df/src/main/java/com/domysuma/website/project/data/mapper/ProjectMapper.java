package com.domysuma.website.project.data.mapper;

import com.domysuma.website.project.data.dto.request.ProjectCreate;
import com.domysuma.website.project.data.dto.request.ProjectUpdate;
import com.domysuma.website.project.data.dto.response.ProjectCreatedResponse;
import com.domysuma.website.project.data.dto.response.ProjectMediaResponse;
import com.domysuma.website.project.data.dto.response.ProjectResponse;
import com.domysuma.website.project.data.dto.response.ProjectSpecResponse;
import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.model.ProjectMedia;
import com.domysuma.website.project.model.ProjectSpec;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {
    @Mapping(target = "specs", ignore = true)
    Project toProjectModel(ProjectCreate projectCreate);

    ProjectResponse toProjectResponse(Project project);

    List<ProjectResponse> toProjectResponses(List<Project> projects);

    ProjectSpecResponse toProjectSpecResponse(ProjectSpec spec);

    ProjectMediaResponse toProjectMediaResponse(ProjectMedia media);

    ProjectCreatedResponse toProjectCreatedResponse(Project project);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateToProjectModel(ProjectUpdate projectUpdate, @MappingTarget Project project);
}
