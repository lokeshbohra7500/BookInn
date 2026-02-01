package com.bookinn.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                // User Service
                                .route("user-service", r -> r
                                                .path("/api/users/**", "/api/auth/**")
                                                .filters(f -> f.stripPrefix(1))
                                                .uri("http://localhost:8081"))

                                // Hotel Service
                                .route("hotel-service", r -> r
                                                .path("/api/hotels/**")
                                                .filters(f -> f.stripPrefix(1))
                                                .uri("http://localhost:8082"))

                                // Booking Service
                                .route("booking-service", r -> r
                                                .path("/api/bookings/**")
                                                .filters(f -> f.stripPrefix(1))
                                                .uri("http://localhost:8083"))

                                // Payment Service
                                .route("payment-service", r -> r
                                                .path("/api/payments/**")
                                                .filters(f -> f.stripPrefix(1))
                                                .uri("http://localhost:8084"))

                                .build();
        }
}
