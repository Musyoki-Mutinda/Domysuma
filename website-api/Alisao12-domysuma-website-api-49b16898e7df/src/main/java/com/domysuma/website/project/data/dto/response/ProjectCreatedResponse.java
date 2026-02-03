package com.domysuma.website.project.data.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProjectCreatedResponse {
    private Long id;
    private String title;
    private String description;
}
