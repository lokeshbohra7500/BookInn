package com.bookinn.bookingservice.config;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {

    /**
     * Forward Authorization header to downstream services.
     * Needed because hotel-service is JWT protected.
     */
    @Bean
    public RequestInterceptor authHeaderForwarder() {
        return requestTemplate -> {

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();

            if (attributes == null) {
                return;
            }

            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null) {
                requestTemplate.header("Authorization", authHeader);
            }
        };
    }
}
