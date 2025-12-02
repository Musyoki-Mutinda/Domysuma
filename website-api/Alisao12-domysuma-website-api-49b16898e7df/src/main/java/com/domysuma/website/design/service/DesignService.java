package com.domysuma.website.design.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.util.Pager;
import com.domysuma.website.core.util.PaginationUtil;
import com.domysuma.website.design.data.DesignSpecification;
import com.domysuma.website.design.data.dto.request.DesignCreate;
import com.domysuma.website.design.data.dto.request.DesignSearch;
import com.domysuma.website.design.data.dto.request.DesignUpdate;
import com.domysuma.website.design.data.dto.response.DesignCreatedResponse;
import com.domysuma.website.design.data.dto.response.DesignDetailResponse;
import com.domysuma.website.design.data.dto.response.DesignResponse;
import com.domysuma.website.design.data.mapper.DesignMapper;
import com.domysuma.website.design.model.Design;
import com.domysuma.website.design.repository.DesignFeatureDetailRepo;
import com.domysuma.website.design.repository.DesignRepo;
import com.domysuma.website.design.repository.DesignSpecRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.domysuma.website.core.util.SlugGenerator.generateSlug;

@Service
@RequiredArgsConstructor
@Transactional
public class DesignService {
    private final DesignRepo designRepo;
    private final DesignSpecRepo designSpecRepo;
    private final DesignFeatureDetailRepo designFeatureDetailRepo;

    private final DesignMapper designMapper;
    private final DesignDetailsService designDetailsService;
    private final DesignMediaService designMediaService;

    public DesignCreatedResponse createDesign(DesignCreate designCreate) {
        var design = designMapper.toEntity(designCreate);

        if (designCreate.getPlanNumber() == null || designCreate.getPlanNumber().isEmpty()) {
            design.setCode(generateDesignCode());
        }

        design.setSlug(generateSlug(design.getTitle(), design.getCode()));

        var designSpecs = designDetailsService.createDesignSpecs(designCreate.getSpecs());
        var designFeatureDetails = designDetailsService.createDesignFeatureDetails(designCreate.getFeatureDetails());

        design.setSpecs(designSpecs);

        var newDesign = designRepo.save(design);

        designSpecs.setDesign(newDesign);
        designSpecRepo.save(designSpecs);

        if (designFeatureDetails != null) {
            designFeatureDetails.forEach(designFeatureDetail -> {
                designFeatureDetail.setDesign(newDesign);
            });

            designFeatureDetailRepo.saveAll(designFeatureDetails);
        }

        designMediaService.createDesignMedia(newDesign, designCreate.getMedia());

        return designMapper.toCreatedResponse(newDesign);
    }

    public void updateDesign(Long designId, DesignUpdate designUpdate) {
        var design = findDesignByIdOrThrow(designId);
        designMapper.updateDesignToModel(designUpdate, design);
        designRepo.save(design);

        var designSpecsUpdate = designUpdate.getSpecs();
        var designFeaturesUpdate = designUpdate.getFeatures();

        designDetailsService.updateDesignSpecs(design, designSpecsUpdate);
        designDetailsService.updateDesignFeatureDetails(designFeaturesUpdate);
    }

    public Pager<List<DesignResponse>> findDesigns(DesignSearch search) {
        var spec = DesignSpecification.createSpecification(search);
        var pageRequest = search.getSortedPageRequest("id");
        var designPage = designRepo.findAll(spec, pageRequest);
        var pager = PaginationUtil.toPager(designPage, "Designs");

        var designResponses = designMapper.toResponses(designPage.getContent());
        pager.setData(designResponses);
        return pager;
    }

    public Pager<List<DesignDetailResponse>> findDesignsWithDetails(DesignSearch search) {
        var spec = DesignSpecification.createSpecification(search);
        var pageRequest = search.getSortedPageRequest("id");
        var designPage = designRepo.findAll(spec, pageRequest);
        var pager = PaginationUtil.toPager(designPage, "Designs");

        var designResponses = designMapper.toResponsesWithDetails(designPage.getContent());
        designDetailsService.setDesignFeaturesInDesignResponse(designResponses, designPage.getContent());
        pager.setData(designResponses);

        return pager;
    }

    public DesignDetailResponse findDesign(Long id) {
        var design = designRepo.findById(id)
                .orElseThrow(() -> APIException.notFound("Design with ID: {0} could not be retrieved.", id));
        var response = designMapper.toDetailResponse(design);
        designDetailsService.setDesignFeaturesInDesignResponse(List.of(response), List.of(design));
        return response;
    }

    public DesignDetailResponse findDesignBySlug(String slug) {
        var design = designRepo.findBySlug(slug)
                .orElseThrow(() -> APIException.notFound("Design could not be retrieved."));
        var response = designMapper.toDetailResponse(design);
        designDetailsService.setDesignFeaturesInDesignResponse(List.of(response), List.of(design));
        return response;
    }

    public Design findDesignByIdOrThrow(Long id) {
        return designRepo.findById(id)
                .orElseThrow(() -> APIException.notFound("Design with ID: {0} could not be retrieved.", id));
    }

    private String generateDesignCode() {
        var currentMonth = LocalDate.now().getMonthValue();
        var currentYear = LocalDate.now().getYear();
        var randomNumber = (int) (Math.random() * (999 - 100) + 100);

        return String.format("%d%d%d", currentYear, currentMonth, randomNumber);
    }

    public void deleteDesign(Long id) {
        designRepo.deleteById(id);
    }

//    @Scheduled(fixedDelay = 10000)
//    public void generateDesignSlug() {
//        var designsWithoutSlug = designRepo.findTop10BySlugIsNull();
//
//        designsWithoutSlug.forEach(design -> {
//            design.setSlug(generateSlug(design.getTitle(), design.getCode()));
//        });
//
//        designRepo.saveAll(designsWithoutSlug);
//    }
}
