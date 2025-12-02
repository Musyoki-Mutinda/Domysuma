package com.domysuma.website.user.data.dto.response;

import lombok.Data;

@Data
public class UserJwtResponse {
    private String userId;
    private String firstName;
    private String lastName;
    private String middleName;
    private String status;
}

