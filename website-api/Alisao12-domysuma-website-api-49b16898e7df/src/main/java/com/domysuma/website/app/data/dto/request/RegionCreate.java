package com.domysuma.website.app.data.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class RegionCreate {
    @NotNull
    private String name;
    private String description;
}
