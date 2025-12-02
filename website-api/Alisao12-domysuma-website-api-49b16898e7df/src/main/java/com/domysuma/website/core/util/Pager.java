package com.domysuma.website.core.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

import java.util.HashMap;

@Data
public class Pager<T> {
    private int status = 200;
    private Boolean success = true;
    private String message;
    private T data;
    @JsonInclude(Include.NON_NULL)
    private PageDetails pageDetails;
    @JsonInclude(Include.NON_NULL)
    private HashMap<String, String> reportParameters;
}
