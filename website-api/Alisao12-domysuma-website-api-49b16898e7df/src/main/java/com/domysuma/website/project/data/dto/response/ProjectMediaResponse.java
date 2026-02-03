package com.domysuma.website.project.data.dto.response;

import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
public class ProjectMediaResponse {
    private Long id;
    private String alt;
    private String title;
    
    // Let Lombok handle this - NO custom getter
    private String path;
    
    @JsonProperty("isDefault")  // Ensure JSON uses snake_case if needed
    private Boolean isDefault = false;
    
    @Enumerated(EnumType.STRING)
    private DesignMediaType mediaType;
    
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup;

    // Add 'url' as an alias for 'path' for frontend compatibility
    @JsonProperty("url")
    public String getUrl() {
        return this.path;
    }
}