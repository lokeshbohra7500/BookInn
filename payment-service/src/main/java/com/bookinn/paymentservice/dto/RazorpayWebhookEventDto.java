package com.bookinn.paymentservice.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RazorpayWebhookEventDto {

    private String event;
    private JsonNode payload;
}
