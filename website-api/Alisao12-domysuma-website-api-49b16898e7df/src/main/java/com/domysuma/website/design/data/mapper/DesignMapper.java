package com.domysuma.website.design.data.mapper;

import com.domysuma.website.design.data.dto.request.DesignCreate;
import com.domysuma.website.design.data.dto.request.DesignUpdate;
import com.domysuma.website.design.data.dto.response.DesignCreatedResponse;
import com.domysuma.website.design.data.dto.response.DesignDetailResponse;
import com.domysuma.website.design.data.dto.response.DesignResponse;
import com.domysuma.website.design.model.Design;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface DesignMapper {
    @Mapping(target = "specs", ignore = true)
    @Mapping(source = "planNumber", target = "code")
    Design toEntity(DesignCreate designCreate);

    @Mapping(source = "code", target = "planNumber")
    @Mapping(source = "defaultImage.path", target = "defaultImage")
    DesignResponse toResponse(Design design);

    List<DesignResponse> toResponses(List<Design> designs);

    @Mapping(source = "code", target = "planNumber")
    @Mapping(target = "features", ignore = true)
    DesignDetailResponse toDetailResponse(Design design);

    List<DesignDetailResponse> toResponsesWithDetails(List<Design> designs);

    @Mapping(source = "code", target = "planNumber")
    DesignCreatedResponse toCreatedResponse(Design design);

    @Mapping(target = "specs", ignore = true)
    @Mapping(target = "features", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(source = "planNumber", target = "code")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateDesignToModel(DesignUpdate designUpdate, @MappingTarget Design design);
}
