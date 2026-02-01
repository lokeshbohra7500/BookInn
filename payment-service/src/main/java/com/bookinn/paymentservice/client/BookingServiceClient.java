package com.bookinn.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bookinn.paymentservice.client.dto.BookingResponseDto;

@FeignClient(name = "BOOKING-SERVICE")
public interface BookingServiceClient {

        @GetMapping("/bookings/{bookingId}")
        BookingResponseDto getBookingById(
                        @PathVariable("bookingId") Long bookingId);

        @PutMapping("/bookings/{bookingId}/payment-success")
        void markBookingPaymentSuccess(
                        @PathVariable("bookingId") Long bookingId);
}
