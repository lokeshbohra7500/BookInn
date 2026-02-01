package com.bookinn.paymentservice.dto;

import java.math.BigDecimal;

import com.bookinn.paymentservice.entity.PaymentStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentResponseDto {

    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentStatus status;
}
