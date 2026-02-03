package com.domysuma.website.project.data.dto.request;

import com.domysuma.website.core.domain.PagedDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ProjectSearch extends PagedDto {
    private String title;
    private String description;
    private String client;
    private String scale;
    private Integer units;
    private Integer durationInMonths;
    private String location;
}
