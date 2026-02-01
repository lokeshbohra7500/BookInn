package com.bookinn.paymentservice.client.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponseDto {

    private Long bookingId;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
}
