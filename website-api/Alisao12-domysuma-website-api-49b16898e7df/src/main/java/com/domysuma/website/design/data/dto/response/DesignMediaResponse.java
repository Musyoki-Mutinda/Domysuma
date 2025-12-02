package com.domysuma.website.design.data.dto.response;

import com.domysuma.website.design.data.enums.DesignMediaGroup;
import com.domysuma.website.design.data.enums.DesignMediaType;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
@Component
public class DesignMediaResponse {
    private Long id;
    private String alt;
    private String title;
    private String path;
    private Boolean isDefault;
    @Enumerated(EnumType.STRING)
    private DesignMediaType mediaType;
    @Enumerated(EnumType.STRING)
    private DesignMediaGroup mediaGroup;

    public String getPath() {
        return "https://domysumake.s3.eu-central-1.amazonaws.com/" + this.path;
    }
}
