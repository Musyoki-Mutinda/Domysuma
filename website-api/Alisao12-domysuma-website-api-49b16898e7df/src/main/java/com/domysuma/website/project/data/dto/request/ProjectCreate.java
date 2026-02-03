package com.domysuma.website.project.data.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ProjectCreate {
    @NotNull
    private String title;
    @NotNull
    private String description;
    private String category;
    private String location;
    private String year;
    private String clientType;
    private String scope; // JSON string of scope array
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
    private List<ProjectMediaCreate> media;
}
