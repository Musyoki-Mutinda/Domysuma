package com.domysuma.website.design.data.dto.request;

import com.domysuma.website.core.domain.PagedDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DesignSearch extends PagedDto {
    private String name;
    private String code;
    private String description;
}
