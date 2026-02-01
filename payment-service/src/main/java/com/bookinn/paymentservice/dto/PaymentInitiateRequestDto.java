package com.bookinn.paymentservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentInitiateRequestDto {

    @NotNull
    private Long bookingId;
}
