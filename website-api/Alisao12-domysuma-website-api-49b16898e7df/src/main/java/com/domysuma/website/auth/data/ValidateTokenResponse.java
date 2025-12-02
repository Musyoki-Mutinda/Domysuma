package com.domysuma.website.auth.data;

import lombok.Data;

@Data
public class ValidateTokenResponse {
    private String resetToken;
    private Long userId;

    public ValidateTokenResponse(Long userId, String resetToken) {
        this.userId = userId;
        this.resetToken = resetToken;
    }
}
