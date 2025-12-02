package com.domysuma.website.design.service;

import com.domysuma.website.app.service.AppDesignService;
import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.design.data.dto.request.DesignFeatureDetailCreate;
import com.domysuma.website.design.data.dto.request.DesignFeatureDetailUpdate;
import com.domysuma.website.design.data.dto.request.DesignSpecCreate;
import com.domysuma.website.design.data.dto.response.DesignDetailResponse;
import com.domysuma.website.design.data.dto.response.DesignFeatureDetailItem;
import com.domysuma.website.design.data.dto.response.DesignFeatureDetailResponse;
import com.domysuma.website.design.data.mapper.DesignSpecMapper;
import com.domysuma.website.design.model.Design;
import com.domysuma.website.design.model.DesignFeatureDetail;
import com.domysuma.website.design.model.DesignSpec;
import com.domysuma.website.design.repository.DesignFeatureDetailRepo;
import com.domysuma.website.design.repository.DesignRepo;
import com.domysuma.website.design.repository.DesignSpecRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DesignDetailsService {
    private final DesignSpecRepo designSpecRepo;
    private final DesignFeatureDetailRepo designFeatureDetailRepo;
    private final DesignRepo designRepo;

    private final DesignSpecMapper designSpecMapper;
    private final AppDesignService appDesignService;

    public DesignSpec createDesignSpecs(DesignSpecCreate designSpecCreate) {
        if (designSpecCreate == null) {
            return new DesignSpec();
        }

        var designSpec = designSpecMapper.toEntity(designSpecCreate);
        return designSpecRepo.save(designSpec);
    }

    public void updateDesignSpecs(Design design, DesignSpecCreate designSpecUpdate) {
        if (designSpecUpdate == null) {
            return;
        }

        var designSpecs = design.getSpecs();
        designSpecMapper.updateSpecsToModel(designSpecUpdate, designSpecs);
        designSpecRepo.save(designSpecs);
    }

    public List<DesignFeatureDetail> createDesignFeatureDetails(DesignFeatureDetailCreate detailCreate) {
        if (detailCreate == null) {
            return null;
        }
        var designFeature = appDesignService.findDesignFeatureByIdOrThrow(detailCreate.getDesignFeatureId());
        if (detailCreate.getDetails().size() > 0) {
            var designFeatureDetails = new ArrayList<DesignFeatureDetail>();
            detailCreate.getDetails().forEach(item -> {
                var designFeatureDetail = new DesignFeatureDetail();
                designFeatureDetail.setDesignFeature(designFeature);
                designFeatureDetail.setDetail(item);

                designFeatureDetails.add(designFeatureDetail);
            });

            return designFeatureDetailRepo.saveAll(designFeatureDetails);
        }

        return null;
    }

    public void updateDesignFeatureDetails(List<DesignFeatureDetailUpdate> designFeaturesUpdate) {
        if (designFeaturesUpdate == null) {
            return;
        }

        var detailsToUpdate = new ArrayList<DesignFeatureDetail>();
        designFeaturesUpdate.forEach(detailUpdate -> {
            var detailToUpdate = findDesignFeatureDetailByIdOrThrow(detailUpdate.getFeatureDetailId());
            detailToUpdate.setDetail(detailUpdate.getDetail());
            detailsToUpdate.add(detailToUpdate);
        });

        designFeatureDetailRepo.saveAll(detailsToUpdate);
    }

    public void addNewDesignFeatureDetails(Long designId, DesignFeatureDetailCreate detailCreate) {
        var design = designRepo.findById(designId).orElseThrow(() -> APIException.notFound("Design with ID: {0} not found.", designId));
        var designFeatureDetails = createDesignFeatureDetails(detailCreate);

        if (designFeatureDetails != null) {
            designFeatureDetails.forEach(designFeatureDetail -> {
                designFeatureDetail.setDesign(design);
            });

            designFeatureDetailRepo.saveAll(designFeatureDetails);
        }
    }

    public void removeDesignFeatureDetails(Long designFeatureDetailId) {
        var designFeatureDetail = findDesignFeatureDetailByIdOrThrow(designFeatureDetailId);
        designFeatureDetailRepo.delete(designFeatureDetail);
    }

    public DesignFeatureDetail findDesignFeatureDetailByIdOrThrow(Long id) {
        return designFeatureDetailRepo.findById(id).orElseThrow(() -> APIException.notFound("Design feature detail with ID: {0} not found.", id));
    }

    public void setDesignFeaturesInDesignResponse(List<DesignDetailResponse> designDetailResponses, List<Design> designs) {
        if (designDetailResponses.isEmpty()) {
            return;
        }

        designDetailResponses.forEach(designResponse -> {
            designs.forEach(design -> {
                if (design.getId().equals(designResponse.getId())) {
                    setDesignFeaturesInDesignResponse(designResponse, design);
                }
            });
        });
    }

    private void setDesignFeaturesInDesignResponse(DesignDetailResponse designDetailResponse, Design design) {
        if (designDetailResponse == null) {
            return;
        }

        var designFeatureDetails = design.getFeatures();
        var designFeatureDetailResponses = new ArrayList<DesignFeatureDetailResponse>();

        designFeatureDetails.forEach(designFeatureDetail -> {
            var featureResponseExists = designFeatureDetailResponses.stream()
                    .filter(designFeatureDetailResponse -> designFeatureDetailResponse.getTitle().equals(designFeatureDetail.getDesignFeature().getTitle())).collect(Collectors.toList());

            if (featureResponseExists.isEmpty()) {
                var designFeatureDetailResponse = new DesignFeatureDetailResponse();
                var detailItems = new ArrayList<DesignFeatureDetailItem>();

                designFeatureDetailResponse.setTitle(designFeatureDetail.getDesignFeature().getTitle());

                var detailItem = new DesignFeatureDetailItem();
                detailItem.setDetail(designFeatureDetail.getDetail());
                detailItem.setId(designFeatureDetail.getId());
                detailItems.add(detailItem);

                designFeatureDetailResponse.setItems(detailItems);
                designFeatureDetailResponses.add(designFeatureDetailResponse);
            } else {
                var existingFeatureResponse = featureResponseExists.get(0);

                var detailItem = new DesignFeatureDetailItem();
                detailItem.setDetail(designFeatureDetail.getDetail());
                detailItem.setId(designFeatureDetail.getId());

                existingFeatureResponse.getItems().add(detailItem);
            }
        });

        designDetailResponse.setFeatures(designFeatureDetailResponses);
    }
}
