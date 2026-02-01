package com.bookinn.paymentservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookinn.paymentservice.service.RazorpayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature
    ) {
        if (!razorpayService.verifyWebhookSignature(payload, signature)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid signature");
        }

        System.out.println("=== VERIFIED RAZORPAY WEBHOOK ===");
        System.out.println(payload);

        return ResponseEntity.ok("ok");
    }
}
