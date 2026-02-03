package com.domysuma.website.app.service;

import com.domysuma.website.app.data.dto.request.DesignFeatureCreate;
import com.domysuma.website.app.data.dto.request.DesignFeatureResponse;
import com.domysuma.website.app.data.mapper.AppDesignMapper;
import com.domysuma.website.app.data.mapper.DesignFeatureUpdate;
import com.domysuma.website.app.model.DesignFeature;
import com.domysuma.website.app.repository.DesignFeatureRepo;
import com.domysuma.website.core.exception.APIException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppDesignService {
    private final DesignFeatureRepo designFeatureRepo;
    private final AppDesignMapper appDesignMapper;

    public void createDesignFeature(DesignFeatureCreate designFeatureCreate) {
        var designFeature = new DesignFeature();
        designFeature.setTitle(designFeatureCreate.getTitle());

        if (designFeatureCreate.getIsMain() != null) {
            designFeature.setIsMain(designFeatureCreate.getIsMain());
        }

        designFeatureRepo.save(designFeature);
    }

    public List<DesignFeatureResponse> getAllDesignFeatures() {
        return appDesignMapper.toDesignFeatureResponses(designFeatureRepo.findAll());
    }

    public void updateDesignFeature(Long id, DesignFeatureUpdate designFeatureUpdate) {
        var designFeatureToUpdate = findDesignFeatureByIdOrThrow(id);
        appDesignMapper.updateToModel(designFeatureUpdate, designFeatureToUpdate);
        designFeatureRepo.save(designFeatureToUpdate);
    }

    public DesignFeature findDesignFeatureByIdOrThrow(Long id) {
        return designFeatureRepo.findById(id)
                .orElseThrow(() -> APIException.notFound("Design feature with ID: {0} not found.", id));
    }
}
