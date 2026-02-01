package com.bookinn.paymentservice.entity;

public enum PaymentStatus {
    CREATED,    // order created, user not paid yet
    SUCCESS,    // payment verified & captured
    FAILED      // payment failed or signature invalid
}
