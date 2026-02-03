package com.domysuma.website.core.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.internal.engine.path.PathImpl;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * @author Kennedy
 */
@Data
@JsonInclude(Include.NON_NULL)
public class ApiError {

    private String code;
    private boolean success = false;
    @JsonIgnore
    private HttpStatus httpStatus;
    private String message;
    private String debugMessage;
    private List<ApiSubError> errors;
    private List<String> error;

    public ApiError() {
    }

    public ApiError(HttpStatus status) {
        this();
        this.httpStatus = status;
        this.code = String.valueOf(status.value());
        this.message = status.getReasonPhrase();
    }

    public ApiError(HttpStatus status, Throwable ex) {
        this();
        this.httpStatus = status;
        this.code = String.valueOf(status.value());
        this.message = ex.getLocalizedMessage();
    }

    public ApiError(HttpStatus status, String message, Throwable ex) {
        this();
        this.code = String.valueOf(status.value());
        this.message = message;
        this.httpStatus = status;
    }

    public ApiError(HttpStatus status, String message) {
        this();
        this.httpStatus = status;
        this.code = String.valueOf(status.value());
        this.message = message;
    }

    public ApiError(HttpStatus status, String message, List<String> errors) {
        super();
        this.httpStatus = status;
        this.message = message;
        this.error = errors;
    }

    public ApiError(HttpStatus status, String message, String error) {
        super();
        this.httpStatus = status;
        this.message = message;
        this.error = Collections.singletonList(error);
    }

    private void addSubError(ApiSubError subError) {
        if (errors == null) {
            errors = new ArrayList<>();
        }
        errors.add(subError);
    }

    private void addValidationError(String field, String message) {
        addSubError(new ApiValidationError(field, message));
    }

    private void addValidationError(String message) {
        addSubError(new ApiValidationError(message));
    }

    private void addValidationError(FieldError fieldError) {
        this.addValidationError(
                fieldError.getField(),
                fieldError.getDefaultMessage());
    }

    void addValidationErrors(List<FieldError> fieldErrors) {
        fieldErrors.forEach(this::addValidationError);
    }

    private void addValidationError(ObjectError objectError) {
        this.addValidationError(objectError.getObjectName(), objectError.getDefaultMessage());
    }

    void addValidationError(List<ObjectError> globalErrors) {
        globalErrors.forEach(this::addValidationError);
    }

    /**
     * Utility method for adding error of ConstraintViolation. Usually when a
     *
     * @param cv the ConstraintViolation
     * @Validated validation fails.
     */
    private void addValidationError(ConstraintViolation<?> cv) {
        this.addValidationError(
                ((PathImpl) cv.getPropertyPath()).getLeafNode().asString(),
                cv.getMessage());
    }

    void addValidationErrors(Set<ConstraintViolation<?>> constraintViolations) {
        constraintViolations.forEach(this::addValidationError);
    }

    abstract class ApiSubError {

    }

    @Data
    @EqualsAndHashCode(callSuper = false)
    @AllArgsConstructor
    class ApiValidationError extends ApiSubError {

        private String field;
        private String message;

        ApiValidationError(String message) {
            this.message = message;
        }
    }
}

