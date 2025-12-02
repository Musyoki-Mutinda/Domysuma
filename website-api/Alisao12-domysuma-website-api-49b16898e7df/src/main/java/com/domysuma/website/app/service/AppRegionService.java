package com.domysuma.website.app.service;

import com.domysuma.website.app.data.dto.request.RegionCreate;
import com.domysuma.website.app.data.dto.response.RegionResponse;
import com.domysuma.website.app.data.mapper.AppRegionMapper;
import com.domysuma.website.app.model.Region;
import com.domysuma.website.app.repository.RegionRepo;
import com.domysuma.website.core.exception.APIException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppRegionService {
    private final RegionRepo regionRepo;
    private final AppRegionMapper appRegionMapper;

    public void createRegion(RegionCreate create) {
        var region = new Region(create.getName(), create.getDescription());
        regionRepo.save(region);
    }

    public List<RegionResponse> getRegions() {
        return appRegionMapper.toRegionResponses(regionRepo.findAll());
    }

    public Region findRegionByIdOrThrow(Long regionId) {
        return regionRepo.findById(regionId)
                .orElseThrow(() -> APIException.notFound("Region with id - {0} not found", regionId));
    }
}
