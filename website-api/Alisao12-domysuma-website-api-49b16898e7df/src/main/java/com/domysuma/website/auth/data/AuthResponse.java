package com.domysuma.website.auth.data;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String id;
    private String code;
    private String username;
    private String role;
    private String refreshToken; // add this
    private String fullName;     // add this
}
