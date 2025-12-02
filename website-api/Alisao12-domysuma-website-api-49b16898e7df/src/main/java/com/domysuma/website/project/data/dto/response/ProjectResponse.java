package com.domysuma.website.project.data.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;
    private String location;
    private ProjectSpecResponse specs;
    private List<ProjectMediaResponse> media;
}
