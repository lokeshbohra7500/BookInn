package com.bookinn.paymentservice.exception;

import java.time.LocalDateTime;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ApiError> handleBadRequest(
                        BadRequestException ex,
                        HttpServletRequest request) {
                return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiError> handleNotFound(
                        ResourceNotFoundException ex,
                        HttpServletRequest request) {
                return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request);
        }

        @ExceptionHandler(PaymentVerificationException.class)
        public ResponseEntity<ApiError> handlePaymentVerification(
                        PaymentVerificationException ex,
                        HttpServletRequest request) {
                return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleGeneric(
                        Exception ex,
                        HttpServletRequest request) {
                return buildError(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                ex.getMessage(),
                                request);
        }

        private ResponseEntity<ApiError> buildError(
                        HttpStatus status,
                        String message,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .timestamp(LocalDateTime.now())
                                .status(status.value())
                                .error(status.getReasonPhrase())
                                .message(message)
                                .path(request.getRequestURI())
                                .build();

                return ResponseEntity.status(status).body(error);
        }
}
