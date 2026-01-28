package com.bookinn.bookingservice.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequestDto {

    private Long hotelId;
    private Long roomTypeId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Integer numberOfRooms;
    private Integer numberOfGuests;
}
