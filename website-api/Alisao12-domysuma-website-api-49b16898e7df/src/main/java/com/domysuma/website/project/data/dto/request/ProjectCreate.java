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
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;
    private String location;
    private ProjectSpecCreate specs;
    private List<ProjectMediaCreate> media;
}
