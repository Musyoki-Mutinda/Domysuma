package com.domysuma.website.core.util;

import org.threeten.extra.YearWeek;

import java.sql.Date;
import java.time.LocalDate;

import static com.domysuma.website.core.constants.DateConstants.TZ;
import static java.time.DayOfWeek.*;

public class CurrentWeekUtil {
    static YearWeek week = YearWeek.now(TZ);

    public static LocalDate monday() {
        return week.atDay(MONDAY);
    }

    public static LocalDate tuesday() {
        return week.atDay(TUESDAY);
    }

    public static LocalDate wednesday() {
        return week.atDay(WEDNESDAY);
    }

    public static LocalDate thursday() {
        return week.atDay(THURSDAY);
    }

    public static LocalDate friday() {
        return week.atDay(FRIDAY);
    }

    public static Date mondayDate() {
        return Date.valueOf(monday());
    }

    public static Date tuesdayDate() {
        return Date.valueOf(tuesday());
    }

    public static Date wednesdayDate() {
        return Date.valueOf(wednesday());
    }

    public static Date thursdayDate() {
        return Date.valueOf(thursday());
    }

    public static Date fridayDate() {
        return Date.valueOf(friday());
    }
}
