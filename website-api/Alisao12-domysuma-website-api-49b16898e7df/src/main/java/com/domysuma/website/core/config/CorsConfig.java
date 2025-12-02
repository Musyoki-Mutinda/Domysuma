package com.domysuma.website.core.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistrationBean() {
        var source = new UrlBasedCorsConfigurationSource();
        var config = new CorsConfiguration();

        // Allow your Angular dev server specifically
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);

        // Allow all standard headers from client
        config.setAllowedHeaders(Arrays.asList("*"));

        // Allow all standard HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Expose any headers needed by client
        config.setExposedHeaders(Arrays.asList("Authorization", "content-length"));

        // Cache preflight requests for 1 hour
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);

        var bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
