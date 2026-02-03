package com.bookinn.bookingservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.bookinn.bookingservice.entity.BookingStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponseDto {

    private Long bookingId;
    private Long userId;
    private Long hotelId;
    private Long roomTypeId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Integer numberOfRooms;
    private Integer numberOfGuests;

    private BigDecimal totalAmount;
    private BookingStatus status;

    private String hotelName;
    private String hotelImage;
    private String city;
    private String state;
    private String roomTypeName;
}
