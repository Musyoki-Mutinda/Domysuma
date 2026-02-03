package com.domysuma.website.design.data.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class DesignUpdate {
    private String title;
    private String description;
    private String planNumber;
    private DesignSpecCreate specs;
    private List<DesignFeatureDetailUpdate> features;
}
