package com.bookinn.bookingservice.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bookinn.bookingservice.dto.BookingResponseDto;
import com.bookinn.bookingservice.dto.CreateBookingRequestDto;
import com.bookinn.bookingservice.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /* ========================= CUSTOMER / ADMIN ========================= */

    @PostMapping
    @PreAuthorize("hasAnyAuthority('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody CreateBookingRequestDto request,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        BookingResponseDto response = bookingService.createBooking(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyAuthority('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDto> getBookingById(
            @PathVariable Long bookingId,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        BookingResponseDto response = bookingService.getBookingById(bookingId, userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('CUSTOMER','ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        List<BookingResponseDto> bookings = bookingService.getMyBookings(userId);

        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasAnyAuthority('CUSTOMER','ADMIN')")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        bookingService.cancelBooking(bookingId, userId);

        return ResponseEntity.noContent().build();
    }

    /* ========================= MANAGER / ADMIN ========================= */

    @GetMapping("/manager/hotel/{hotelId}")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByHotel(@PathVariable Long hotelId) {

        List<BookingResponseDto> bookings = bookingService.getBookingsByHotel(hotelId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/manager/hotel/{hotelId}/booking/{bookingId}")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<BookingResponseDto> getBookingForHotel(
            @PathVariable Long hotelId,
            @PathVariable Long bookingId) {

        BookingResponseDto response = bookingService.getBookingForHotel(bookingId, hotelId);
        return ResponseEntity.ok(response);
    }

    /* ========================= ADMIN ONLY ========================= */

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {

        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(@PathVariable Long userId) {

        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}
