package com.domysuma.website.project.data.mapper;

import com.domysuma.website.project.data.dto.request.ProjectSpecCreate;
import com.domysuma.website.project.model.ProjectSpec;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectSpecMapper {
    ProjectSpec toEntity(ProjectSpecCreate specCreate);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateToProjectSpecModel(ProjectSpecCreate projectSpecUpdate, @MappingTarget ProjectSpec projectSpec);
}
