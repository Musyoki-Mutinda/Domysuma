package com.domysuma.website.design.data.dto.response;

import lombok.Data;

@Data
public class DesignSpecResponse {
    private Long id;
    private String bedrooms;
    private String bathrooms;
    private String storeys;
    private String area;
    private String width;
    private String length;
}
