package com.domysuma.website.core.util;

import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;

import static com.domysuma.website.core.constants.DateConstants.TZ;

public class CurrentMonthUtil {
    static YearMonth month = YearMonth.now(TZ);

    public static LocalDate start() {
        return month.atDay(1);
    }

    public static LocalDate end() {
        return month.atEndOfMonth();
    }

    public static Date startDate() {
        return Date.valueOf(start());
    }

    public static Date endDate() {
        return Date.valueOf(end());
    }
}
