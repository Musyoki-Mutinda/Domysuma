package com.domysuma.website.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ApiResponse {

    private int status = 200;
    @JsonIgnore
    private HttpStatus httpStatus;
    private String message;
    private boolean success = true;
    private Object data;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, int status, Object data) {
        this.status = status;
        this.message = message;
        this.success = success;
        this.data = data;
    }

    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public static ApiResponse ok(Object payload) {
        return new ApiResponse(true, "Success", HttpStatus.OK.value(), payload);
    }

    public static ApiResponse successMessage(String message) {
        return new ApiResponse(true, message, HttpStatus.OK.value(), message);
    }

    public static ApiResponse errorMessage(String message, HttpStatus status, Object payload) {
        return new ApiResponse(false, message, status.value(), payload);
    }

    public ApiResponse(Object data) {
        this.data = data;
    }
}
