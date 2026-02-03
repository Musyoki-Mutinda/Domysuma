package com.domysuma.website.core.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

/**
 * Utility class for generating random Strings.
 */
@Service
public final class RandomUtil {

    private static final int DEF_COUNT = 10;

    private RandomUtil() {
    }

    public static String getRandomAlphanumeric() {
        return RandomStringUtils.randomAlphanumeric(DEF_COUNT);
    }

    public static String getRandomAlphanumeric(String prefix, int length) {
        var code = prefix + RandomStringUtils.randomAlphanumeric(length);
        return code.toUpperCase();
    }

    public static String getRandomAlphanumeric(int length) {
        var code = RandomStringUtils.randomAlphanumeric(length);
        return code.toUpperCase();
    }
}
