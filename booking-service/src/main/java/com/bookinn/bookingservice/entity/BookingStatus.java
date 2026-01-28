package com.bookinn.bookingservice.entity;

public enum BookingStatus {
    PENDING,        // created but not confirmed
    CONFIRMED,      // payment done
    CANCELLED,      // cancelled by user/admin
    COMPLETED       // stay completed
}
