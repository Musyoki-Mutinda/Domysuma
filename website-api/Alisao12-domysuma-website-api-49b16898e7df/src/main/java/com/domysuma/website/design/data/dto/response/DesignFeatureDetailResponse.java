package com.domysuma.website.design.data.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class DesignFeatureDetailResponse {
    private String title;
    private List<DesignFeatureDetailItem> items;
}
