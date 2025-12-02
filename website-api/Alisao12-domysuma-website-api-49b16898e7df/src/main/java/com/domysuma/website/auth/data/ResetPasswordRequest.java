package com.domysuma.website.auth.data;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ResetPasswordRequest {
    @NotNull
    private Long userId;
    @NotNull
    private String resetToken;
    @NotNull
    private String password;
}
