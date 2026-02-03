package com.domysuma.website.user.data.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class UserCreate {
    private String username;
    @NotNull
    private String password;
    @NotNull
    private String firstName;
    @NotNull
    @Email
    private String email;
    private String lastName;
    private String phoneNumber;
    private Long regionId;
}
