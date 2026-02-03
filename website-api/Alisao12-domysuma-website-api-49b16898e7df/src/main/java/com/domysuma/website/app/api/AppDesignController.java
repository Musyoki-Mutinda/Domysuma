package com.domysuma.website.app.api;

import com.domysuma.website.app.data.dto.request.DesignFeatureCreate;
import com.domysuma.website.app.data.mapper.DesignFeatureUpdate;
import com.domysuma.website.app.service.AppDesignService;
import com.domysuma.website.core.domain.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Tag(name = "App")
@RestController
@RequestMapping("/api/app")
@RequiredArgsConstructor
public class AppDesignController {
    private final AppDesignService appDesignService;

    @PostMapping("design-feature")
    private ApiResponse createDesignFeature(@Valid @RequestBody DesignFeatureCreate designFeatureCreate) {
        appDesignService.createDesignFeature(designFeatureCreate);
        return ApiResponse.ok("Success");
    }

    @GetMapping("design-feature")
    ApiResponse getAllDesignFeatures() {
        return ApiResponse.ok(appDesignService.getAllDesignFeatures());
    }

    @PutMapping("design-feature/{id}")
    ApiResponse updateDesignFeature(@PathVariable Long id, @RequestBody DesignFeatureUpdate designFeatureUpdate) {
        appDesignService.updateDesignFeature(id, designFeatureUpdate);
        return ApiResponse.ok("Design feature updated");
    }
}
