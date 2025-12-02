package com.domysuma.website.design.data.mapper;

import com.domysuma.website.design.data.dto.response.DesignFeatureDetailResponse;
import com.domysuma.website.design.model.DesignFeatureDetail;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DesignFeatureDetailMapper {
}
