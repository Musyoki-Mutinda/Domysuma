package com.domysuma.website.core.util;

import java.text.Normalizer;
import java.util.Locale;

public class SlugGenerator {

    public static String generateSlug(String... inputStrings) {
        StringBuilder combinedString = new StringBuilder();

        for (String input : inputStrings) {
            if (input == null || input.isEmpty()) {
                continue;
            }

            // Remove diacritical marks (accents) from characters
            String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                    .replaceAll("\\p{M}", "");

            // Replace non-alphanumeric characters (except hyphens) with spaces
            String cleaned = normalized.replaceAll("[^a-zA-Z0-9\\s-]", "")
                    .toLowerCase(Locale.ENGLISH);

            // Append the cleaned string to the combined string
            combinedString.append(cleaned).append(" ");
        }

        // Replace spaces with hyphens and remove trailing spaces
        return combinedString.toString().trim().replaceAll("\\s+", "-");
    }
}
