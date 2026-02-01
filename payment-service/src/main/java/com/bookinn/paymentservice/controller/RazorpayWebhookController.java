package com.bookinn.paymentservice.controller;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookinn.paymentservice.service.PaymentService;
import com.bookinn.paymentservice.service.RazorpayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;
    private final PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        // Verify webhook signature
        if (!razorpayService.verifyWebhookSignature(payload, signature)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid signature");
        }

        try {
            // Parse webhook payload
            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            JSONObject payloadData = event.getJSONObject("payload");
            JSONObject paymentEntity = payloadData.getJSONObject("payment").getJSONObject("entity");

            // Handle payment.captured event
            if ("payment.captured".equals(eventType)) {
                String razorpayOrderId = paymentEntity.getString("order_id");
                String razorpayPaymentId = paymentEntity.getString("id");

                // Process payment success via webhook
                paymentService.processWebhookPaymentSuccess(razorpayOrderId, razorpayPaymentId);
            }

            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            // Log error but return 200 to prevent Razorpay retries
            return ResponseEntity.ok("Webhook received");
        }
    }
}
