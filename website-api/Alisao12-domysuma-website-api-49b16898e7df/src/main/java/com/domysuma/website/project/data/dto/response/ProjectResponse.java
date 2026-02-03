package com.domysuma.website.project.data.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProjectResponse {
    private Long id;
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
    private Boolean published;
    private ProjectSpecResponse specs;
    private List<ProjectMediaResponse> media;
    private List<ProjectMediaResponse> galleryImages;
    private List<ProjectMediaResponse> architecturalDrawings;
}
