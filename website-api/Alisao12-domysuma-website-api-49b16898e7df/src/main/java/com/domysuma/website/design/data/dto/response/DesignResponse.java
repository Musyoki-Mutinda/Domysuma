package com.domysuma.website.design.data.dto.response;

import lombok.Data;

@Data
public class DesignResponse {
    private String slug;
    private String title;
    private String planNumber;
    private String description;
    private String defaultImage;
    private Boolean status;

    public String getDefaultImage() {
        if (this.defaultImage == null) {
            return "https://images.placeholders.dev/?width=200&height=200&text=" + this.planNumber;
        }
        return "https://domysuma.s3.eu-central-1.amazonaws.com/" + this.defaultImage;
    }
}
