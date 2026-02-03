package com.domysuma.website.design.data.mapper;

import com.domysuma.website.design.data.dto.request.DesignMediaCreate;
import com.domysuma.website.design.model.DesignMedia;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DesignMediaMapper {
    DesignMedia toEntity(DesignMediaCreate designMediaCreate);
}
