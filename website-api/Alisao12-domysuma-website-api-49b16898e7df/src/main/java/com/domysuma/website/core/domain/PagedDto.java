package com.domysuma.website.core.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import javax.persistence.MappedSuperclass;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@MappedSuperclass
public abstract class PagedDto {
    @Min(value = 1, message = "A valid page number is required: min is 1")
    @NotNull
    private Integer page = 1;
    @NotNull
    @Min(value = 1, message = "A valid page size is required: min is 1")
    private Integer size = 100;

    public PageRequest getPageRequest() {
        return PageRequest.of(getPage(), getSize());
    }

    public PageRequest getSortedPageRequest(String sortBy) {
        return PageRequest.of(getPage(), getSize(), Sort.by(Sort.Direction.DESC, sortBy));
    }

    public PageRequest getSortedPageRequest() {
        return PageRequest.of(getPage(), getSize(), Sort.by(Sort.Direction.DESC, "createdOn"));
    }

    public Integer getPage() {
        return page - 1;
    }
}
