package com.bookinn.paymentservice.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinn.paymentservice.client.BookingServiceClient;
import com.bookinn.paymentservice.dto.PaymentInitiateResponseDto;
import com.bookinn.paymentservice.dto.PaymentVerifyRequestDto;
import com.bookinn.paymentservice.entity.Payment;
import com.bookinn.paymentservice.entity.PaymentGateway;
import com.bookinn.paymentservice.entity.PaymentStatus;
import com.bookinn.paymentservice.exception.BadRequestException;
import com.bookinn.paymentservice.exception.PaymentVerificationException;
import com.bookinn.paymentservice.exception.ResourceNotFoundException;
import com.bookinn.paymentservice.repository.PaymentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingServiceClient bookingServiceClient;
    private final RazorpayService razorpayService;
    private final ObjectMapper objectMapper;


    /**
     * Step 1: Initiate payment
     */
    public PaymentInitiateResponseDto initiatePayment(Long bookingId, Long userId) {

        if (userId == null) {
            throw new BadRequestException("Invalid user context");
        }

        var booking = bookingServiceClient.getBookingById(bookingId);

        if (!booking.getUserId().equals(userId)) {
            throw new BadRequestException("You do not own this booking");
        }

        if (!"PENDING".equals(booking.getStatus())) {
            throw new BadRequestException("Booking is not in payable state");
        }

        BigDecimal amount = booking.getTotalAmount();

        var razorpayOrder = razorpayService.createOrder(amount, bookingId);

        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .userId(userId)
                .amount(amount)
                .currency("INR")
                .gateway(PaymentGateway.RAZORPAY)
                .gatewayOrderId(razorpayOrder.getOrderId())
                .status(PaymentStatus.CREATED)
                .build();

        paymentRepository.save(payment);

        return PaymentInitiateResponseDto.builder()
                .orderId(razorpayOrder.getOrderId())
                .amount(amount)
                .currency("INR")
                .razorpayKey(razorpayOrder.getKey())
                .build();
    }

    /**
     * Step 2: Verify payment (frontend callback)
     */
    public void verifyPayment(PaymentVerifyRequestDto request, Long userId) {

        if (userId == null) {
            throw new BadRequestException("Invalid user context");
        }

        Payment payment = paymentRepository
                .findByGatewayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new BadRequestException("Payment not found"));

        if (!payment.getUserId().equals(userId)) {
            throw new BadRequestException("Invalid payment owner");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return; // idempotent
        }

        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!valid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new PaymentVerificationException("Payment verification failed");
        }

        payment.setGatewayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        bookingServiceClient.markBookingPaymentSuccess(payment.getBookingId());
    }

    /**
     * Step 3: Razorpay webhook (final authority)
     */
    public void handleWebhook(String payload, String signature) {

    	boolean valid = razorpayService.verifyWebhookSignature(
    	        payload,
    	        signature
    	);

        if (!valid) {
            log.warn("Invalid Razorpay webhook signature");
            return;
        }

        try {
            JsonNode root = objectMapper.readTree(payload);
            String event = root.path("event").asText();

            if (!"payment.captured".equals(event)) {
                return;
            }

            JsonNode paymentEntity = root
                    .path("payload")
                    .path("payment")
                    .path("entity");

            String orderId = paymentEntity.path("order_id").asText();
            String paymentId = paymentEntity.path("id").asText();

            Payment payment = paymentRepository
                    .findByGatewayOrderId(orderId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Payment not found for orderId"));

            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                return; // idempotent
            }

            payment.setGatewayPaymentId(paymentId);
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            bookingServiceClient.markBookingPaymentSuccess(payment.getBookingId());

        } catch (Exception e) {
            // Never throw from webhook – Razorpay retries automatically
            log.error("Failed to process Razorpay webhook", e);
        }
    }
}
