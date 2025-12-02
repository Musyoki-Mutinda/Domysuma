package com.domysuma.website.design.data.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class DesignCreate {
    @NotNull
    private String title;
    @NotNull
    private String description;
    private String planNumber;
    private DesignSpecCreate specs;
    private DesignFeatureDetailCreate featureDetails;
    private List<DesignMediaCreate> media;
}
