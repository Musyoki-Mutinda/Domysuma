package com.domysuma.website.project.data.dto.request;

import lombok.Data;

@Data
public class ProjectUpdate {
    private String title;
    private String description;
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;
    private String location;
    private ProjectSpecCreate specs;
}
