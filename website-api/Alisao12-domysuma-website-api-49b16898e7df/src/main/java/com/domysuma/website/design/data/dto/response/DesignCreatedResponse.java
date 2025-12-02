package com.domysuma.website.design.data.dto.response;

import lombok.Data;

@Data
public class DesignCreatedResponse {
    private Long id;
    private String title;
    private String slug;
    private String planNumber;
    private String description;
}
