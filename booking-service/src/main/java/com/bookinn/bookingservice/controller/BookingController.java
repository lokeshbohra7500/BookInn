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

    @PostMapping("/book_hotel")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody CreateBookingRequestDto request,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        BookingResponseDto response = bookingService.createBooking(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam("hotelId") Long hotelId,
            @RequestParam("roomTypeId") Long roomTypeId,
            @RequestParam("checkIn") java.time.LocalDate checkIn,
            @RequestParam("checkOut") java.time.LocalDate checkOut,
            @RequestParam(value = "rooms", defaultValue = "1") Integer rooms) {

        // Need total rooms from hotel service
        com.bookinn.bookingservice.dto.HotelRoomPriceResponse priceResponse = bookingService.getHotelRoomPrice(hotelId,
                roomTypeId);
        boolean available = bookingService.isRoomAvailable(hotelId, roomTypeId, checkIn, checkOut, rooms,
                priceResponse.getTotalRooms());
        return ResponseEntity.ok(available);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDto> getBookingById(
            @PathVariable("bookingId") Long bookingId,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        BookingResponseDto response = bookingService.getBookingById(bookingId, userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable("bookingId") Long bookingId,
            HttpServletRequest requestContext) {

        Long userId = (Long) requestContext.getAttribute("userId");
        bookingService.cancelBooking(bookingId, userId);

        return ResponseEntity.noContent().build();
    }

    /* ========================= MANAGER / ADMIN ========================= */

    @GetMapping("/manager/hotel/{hotelId}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByHotel(
            @PathVariable("hotelId") Long hotelId) {

        return ResponseEntity.ok(bookingService.getBookingsByHotel(hotelId));
    }

    @GetMapping("/manager/hotel/{hotelId}/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<BookingResponseDto> getBookingForHotel(
            @PathVariable("hotelId") Long hotelId,
            @PathVariable("bookingId") Long bookingId) {

        return ResponseEntity.ok(
                bookingService.getBookingForHotel(bookingId, hotelId));
    }

    /* ========================= ADMIN ONLY ========================= */

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {

        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(
            @PathVariable("userId") Long userId) {

        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    /*
     * ========================= INTERNAL / SERVICE CALLS =========================
     */

    @PutMapping("/{bookingId}/payment-success")
    public ResponseEntity<Void> markBookingPaymentSuccess(@PathVariable("bookingId") Long bookingId) {
        bookingService.markBookingPaymentSuccess(bookingId);
        return ResponseEntity.ok().build();
    }
}