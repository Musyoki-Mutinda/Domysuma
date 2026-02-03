package com.domysuma.website.design.data.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class DesignFeatureDetailCreate {
    private Long designFeatureId;
    private List<String> details;
}
