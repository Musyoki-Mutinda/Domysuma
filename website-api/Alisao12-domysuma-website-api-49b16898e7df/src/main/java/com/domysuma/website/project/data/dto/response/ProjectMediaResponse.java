package com.domysuma.website.project.data.dto.response;

import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
public class ProjectMediaResponse {
    private Long id;
    private String alt;
    private String title;
    private String path;
    private Boolean isDefault = false;
    @Enumerated(EnumType.STRING)
    private DesignMediaType mediaType;
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup;

    public String getPath() {
        return "https://domysuma.s3.eu-central-1.amazonaws.com/" + this.path;
    }
}
