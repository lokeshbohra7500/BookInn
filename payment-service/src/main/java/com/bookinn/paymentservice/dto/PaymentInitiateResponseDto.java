package com.bookinn.paymentservice.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentInitiateResponseDto {

    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String razorpayKey;
}
