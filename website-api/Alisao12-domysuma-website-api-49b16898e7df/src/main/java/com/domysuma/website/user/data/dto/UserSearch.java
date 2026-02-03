package com.domysuma.website.user.data.dto;

import com.domysuma.website.core.domain.PagedDto;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Getter;
import lombok.Setter;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Getter
@Setter
public class UserSearch extends PagedDto {
    private String username;
}
