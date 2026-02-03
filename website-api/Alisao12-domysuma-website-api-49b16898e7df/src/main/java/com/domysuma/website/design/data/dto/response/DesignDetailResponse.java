package com.domysuma.website.design.data.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class DesignDetailResponse {
    private Long id;
    private String title;
    private String planNumber;
    private String description;
    private String slug;
    private DesignSpecResponse specs;
    private List<DesignFeatureDetailResponse> features;
    private List<DesignMediaResponse> media;
}
