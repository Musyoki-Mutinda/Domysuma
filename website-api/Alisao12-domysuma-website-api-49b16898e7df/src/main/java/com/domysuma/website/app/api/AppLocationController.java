package com.domysuma.website.app.api;

import com.domysuma.website.app.data.dto.request.RegionCreate;
import com.domysuma.website.app.service.AppRegionService;
import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.user.model.Role;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@Tag(name = "App")
@RestController
@RequestMapping("/api/app")
@RequiredArgsConstructor
public class AppLocationController {
    private final AppRegionService appRegionService;

    @PostMapping("/region")
    @RolesAllowed({Role.ADMIN, Role.SUPER_ADMIN})
    public ApiResponse createRegion(@RequestBody RegionCreate request) {
        appRegionService.createRegion(request);
        return ApiResponse.successMessage("Region created successfully");
    }

    @GetMapping("/region")
    public ApiResponse getRegions() {
        return ApiResponse.ok(appRegionService.getRegions());
    }
}
