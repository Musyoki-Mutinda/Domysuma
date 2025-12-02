package com.domysuma.website.user.data.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String phoneNumber;
    private Boolean status;
}

