package com.domysuma.website.project.data.dto.request;

import lombok.Data;

@Data
public class ProjectUpdate {
    private String title;
    private String description;
    private String category;
    private String location;
    private String year;
    private String clientType;
    private String scope;
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;
    private String county;
    private String totalFloorArea;
    private String structuralSystem;
    private String interiorFeatures;
    private String longDescription;
    private String designer;
    private ProjectSpecCreate specs;
}
