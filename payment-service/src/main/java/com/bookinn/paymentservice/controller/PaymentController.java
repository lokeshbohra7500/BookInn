package com.bookinn.paymentservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bookinn.paymentservice.dto.PaymentInitiateRequestDto;
import com.bookinn.paymentservice.dto.PaymentInitiateResponseDto;
import com.bookinn.paymentservice.dto.PaymentVerifyRequestDto;
import com.bookinn.paymentservice.exception.BadRequestException;
import com.bookinn.paymentservice.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponseDto> initiatePayment(
            @Valid @RequestBody PaymentInitiateRequestDto request,
            HttpServletRequest servletRequest) {
        Long userId = (Long) servletRequest.getAttribute("userId");

        PaymentInitiateResponseDto response = paymentService.initiatePayment(request.getBookingId(), userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequestDto request,
            HttpServletRequest servletRequest) {
        Long userId = (Long) servletRequest.getAttribute("userId");

        if (userId == null) {
            throw new BadRequestException("User authentication required");
        }

        paymentService.verifyPayment(request, userId);
        return ResponseEntity.ok().build();
    }
}
