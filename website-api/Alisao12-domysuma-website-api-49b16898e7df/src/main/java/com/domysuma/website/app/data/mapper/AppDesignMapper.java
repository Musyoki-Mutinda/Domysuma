package com.domysuma.website.app.data.mapper;

import com.domysuma.website.app.data.dto.request.DesignFeatureResponse;
import com.domysuma.website.app.model.DesignFeature;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface AppDesignMapper {
    List<DesignFeatureResponse> toDesignFeatureResponses(List<DesignFeature> designFeatures);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateToModel(DesignFeatureUpdate designFeatureUpdate, @MappingTarget DesignFeature designFeature);
}
