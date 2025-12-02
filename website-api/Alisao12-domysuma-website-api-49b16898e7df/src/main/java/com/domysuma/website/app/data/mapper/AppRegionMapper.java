package com.domysuma.website.app.data.mapper;

import com.domysuma.website.app.data.dto.request.DesignFeatureResponse;
import com.domysuma.website.app.data.dto.response.RegionResponse;
import com.domysuma.website.app.model.DesignFeature;
import com.domysuma.website.app.model.Region;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface AppRegionMapper {
    RegionResponse toRegionResponse(Region region);

    List<RegionResponse> toRegionResponses(List<Region> regions);
}
