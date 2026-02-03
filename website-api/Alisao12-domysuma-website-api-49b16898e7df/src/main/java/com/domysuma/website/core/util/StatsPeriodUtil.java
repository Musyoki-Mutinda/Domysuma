package com.domysuma.website.core.util;

import com.domysuma.website.core.domain.StatsDateRange;
import com.domysuma.website.core.domain.StatsPeriod;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.Date;

public class StatsPeriodUtil {
    public static final DateTimeFormatter LOCAL_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter LOCAL_DATE_TIME_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd HH:mm:ss")
            .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
            .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .parseDefaulting(ChronoField.MILLI_OF_SECOND, 0)
            .toFormatter();

    public static StatsDateRange getDateRange(StatsPeriod statsPeriod) {
        var todayDateFormat = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        var todayEndDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        var monthDateFormat = new SimpleDateFormat("yyyy-MM-01 00:00:00");
        var yearDateFormat = new SimpleDateFormat("yyyy-01-01 00:00:00");
        var statsDateRange = new StatsDateRange();
        var startDate = "";
        var endDate = "";
        statsDateRange.setFrom(startDate);
        statsDateRange.setTo(endDate);

        switch (statsPeriod.name()) {
            case "TODAY":
                startDate = todayDateFormat.format(new Date());
                endDate = todayEndDateFormat.format(new Date());
                statsDateRange.setFrom(startDate);
                statsDateRange.setTo(endDate);
                return statsDateRange;
            case "TODAY_LOCAL_DATE":
                startDate = (LocalDate.now().format(LOCAL_DATE_FORMATTER));
                endDate = (LocalDate.now().format(LOCAL_DATE_FORMATTER));
                statsDateRange.setFrom(startDate);
                statsDateRange.setTo(endDate);
                return statsDateRange;
            case "TODAY_LOCAL_DATE_TIME":
                startDate = (LocalDate.now().atStartOfDay().format(LOCAL_DATE_TIME_FORMATTER));
                endDate = (LocalDateTime.now().format(LOCAL_DATE_TIME_FORMATTER));
                statsDateRange.setFrom(startDate);
                statsDateRange.setTo(endDate);
                return statsDateRange;
            case "MONTH_TO_DATE":
                startDate = monthDateFormat.format(new Date());
                endDate = todayEndDateFormat.format(new Date());
                statsDateRange.setFrom(startDate);
                statsDateRange.setTo(endDate);
                return statsDateRange;
            case "YEAR_TO_DATE":
                startDate = yearDateFormat.format(new Date());
                endDate = todayEndDateFormat.format(new Date());
                statsDateRange.setFrom(startDate);
                statsDateRange.setTo(endDate);
                return statsDateRange;
            default:
                throw new IllegalStateException("Unexpected value: " + statsPeriod);
        }
    }
}
