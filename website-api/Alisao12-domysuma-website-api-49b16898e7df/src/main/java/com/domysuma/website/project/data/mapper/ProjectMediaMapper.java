package com.domysuma.website.project.data.mapper;

import com.domysuma.website.project.data.dto.request.ProjectMediaCreate;
import com.domysuma.website.project.model.ProjectMedia;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMediaMapper {
    ProjectMedia toEntity(ProjectMediaCreate mediaCreate);
}
