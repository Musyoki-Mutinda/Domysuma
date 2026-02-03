/*package com.domysuma.website.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // Apply CORS to all API endpoints
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://domysumaarchitects.co.ke",      // main frontend
                    "https://admin.domysumaarchitects.co.ke" // optional admin subdomain
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)  // required for cookies or session auth
                .maxAge(3600);           // cache preflight for 1 hour
    }
}
*/