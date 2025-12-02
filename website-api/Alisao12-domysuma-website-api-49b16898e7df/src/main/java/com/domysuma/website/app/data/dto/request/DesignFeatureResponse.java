package com.domysuma.website.app.data.dto.request;

import lombok.Data;

@Data
public class DesignFeatureResponse {
    private Long id;
    private String title;
    // If it is main it will appear beside the images slide on the design idea detail page - multiple isMain supported.
    private Boolean isMain = false;
}
