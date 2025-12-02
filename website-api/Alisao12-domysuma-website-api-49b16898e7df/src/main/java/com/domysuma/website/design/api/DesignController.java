package com.domysuma.website.design.api;

import com.domysuma.website.core.domain.ApiResponse;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.design.data.dto.request.*;
import com.domysuma.website.design.data.dto.response.DesignDetailResponse;
import com.domysuma.website.design.data.dto.response.DesignResponse;
import com.domysuma.website.design.service.DesignDetailsService;
import com.domysuma.website.design.service.DesignMediaService;
import com.domysuma.website.design.service.DesignService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Tag(name = "Design Ideas")
@RestController
@RequestMapping(path = "api/design")
@RequiredArgsConstructor
@Slf4j
public class DesignController {
    private final DesignService designService;
    private final DesignDetailsService designDetailsService;
    private final DesignMediaService designMediaService;

    @PostMapping
    public ApiResponse createDesign(@Valid @RequestBody DesignCreate request) {
        return ApiResponse.ok(designService.createDesign(request));
    }

    @GetMapping
    public Pager<List<DesignDetailResponse>> findDesignsWithDetails(DesignSearch search) {
        return designService.findDesignsWithDetails(search);
    }

    @GetMapping("simple")
    public Pager<List<DesignResponse>> findDesigns(DesignSearch search) {
        return designService.findDesigns(search);
    }

    @GetMapping("{id}")
    public ApiResponse findDesign(@PathVariable Long id) {
        return ApiResponse.ok(designService.findDesign(id));
    }

    @GetMapping("slug/{slug}")
    public ApiResponse findDesignByPlanNumber(@PathVariable String slug) {
        return ApiResponse.ok(designService.findDesignBySlug(slug));
    }

    @PutMapping("{id}")
    public ApiResponse updateDesign(@PathVariable Long id, @Valid @RequestBody DesignUpdate request) {
        designService.updateDesign(id, request);
        return ApiResponse.successMessage("Design updated successfully");
    }

    @DeleteMapping("{id}")
    public ApiResponse deleteDesign(@PathVariable Long id) {
        designService.deleteDesign(id);
        return ApiResponse.successMessage("Design deleted successfully");
    }

    @PostMapping("{designId}/add-feature-detail")
    public ApiResponse addDesignFeatureDetails(@PathVariable Long designId, @Valid @RequestBody DesignFeatureDetailCreate detailCreate) {
        designDetailsService.addNewDesignFeatureDetails(designId, detailCreate);
        return ApiResponse.ok("Design feature detail added");
    }

    @DeleteMapping("remove-feature-detail/{designFeatureDetailId}")
    public ApiResponse removeDesignFeatureDetail(@PathVariable Long designFeatureDetailId) {
        designDetailsService.removeDesignFeatureDetails(designFeatureDetailId);
        return ApiResponse.ok("Design feature detail removed");
    }

    @PostMapping("{designId}/add-media")
    public ApiResponse addDesignMedia(@PathVariable Long designId, @Valid @RequestBody List<DesignMediaCreate> mediaCreate) {
        designMediaService.addDesignMedia(designId, mediaCreate);
        return ApiResponse.ok("Design media added");
    }

    @DeleteMapping("media/{designMediaId}")
    public ApiResponse removeDesignMedia(@PathVariable Long designMediaId) {
        designMediaService.removeDesignMedia(designMediaId);
        return ApiResponse.ok("Design media removed");
    }

    @PutMapping("media/{designMediaId}/make-default")
    public ApiResponse makeDesignMediaDefault(@PathVariable Long designMediaId) {
        designMediaService.makeDesignMediaDefault(designMediaId);
        return ApiResponse.ok("Design media set as default");
    }
}
