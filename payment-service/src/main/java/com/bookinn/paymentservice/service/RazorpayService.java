package com.bookinn.paymentservice.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    /**
     * Create Razorpay order (payment intent)
     */
    public RazorpayOrder createOrder(BigDecimal amount, Long bookingId) {
        try {
            Map<String, Object> options = new HashMap<>();

            // Razorpay expects amount in paise
            options.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue());
            options.put("currency", "INR");
            options.put("receipt", "booking_" + bookingId);

            Order order = razorpayClient.orders.create(new JSONObject(options));

            // ✅ return Key ID (public) to frontend
            return new RazorpayOrder(order.get("id"), razorpayKeyId);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    /**
     * Verify payment signature (frontend flow)
     */
    public boolean verifySignature(
            String orderId,
            String paymentId,
            String signature) {
        try {
            JSONObject payload = new JSONObject();
            payload.put("razorpay_order_id", orderId);
            payload.put("razorpay_payment_id", paymentId);
            payload.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(payload, razorpaySecret);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Verify Razorpay webhook signature (server-to-server)
     */
    public boolean verifyWebhookSignature(
            String payload,
            String razorpaySignature) {
        try {
            return Utils.verifyWebhookSignature(
                    payload,
                    razorpaySignature,
                    webhookSecret);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Internal DTO – keeps SDK objects out of service layer
     */
    @Getter
    public static class RazorpayOrder {
        private final String orderId;
        private final String key;

        public RazorpayOrder(String orderId, String key) {
            this.orderId = orderId;
            this.key = key;
        }
    }
}
