package com.domysuma.website.project.data.dto.request;

import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Data;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

@Data
public class ProjectMediaCreate {
    private String alt;
    private String title;
    private String path;
    private Boolean isDefault = false;
    @NotNull
    private String encodedFile;
    @NotNull
    @Enumerated(EnumType.STRING)
    private DesignMediaType mediaType = DesignMediaType.IMAGE;
    @NotNull
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup = DesignMediaGroup.IMAGES;
}
