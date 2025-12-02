package com.domysuma.website.core.util;

import org.springframework.data.domain.Page;

/**
 * Utility class for handling pagination.
 */
public final class PaginationUtil {

    private PaginationUtil() {
    }
    
    public static Pager toPager(Page<?> page, String reportName) {
        var pager = new Pager<>();
        pager.setStatus(200);
        pager.setMessage("Success");
        pager.setData(page.getContent());
        PageDetails details = new PageDetails();
        details.setPage(page.getNumber() + 1);
        details.setPerPage(page.getSize());
        details.setTotalElements(page.getTotalElements());
        details.setTotalPage(page.getTotalPages());
        details.setReportName(reportName);
        pager.setPageDetails(details);
        return pager;
    }
}
