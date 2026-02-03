package com.domysuma.website.core.exception;

import lombok.Data;

@Data
public class ApiErrorDesc {
    private String error;
    private String error_description;
    private String message;
}