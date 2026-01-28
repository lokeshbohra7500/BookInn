package com.bookinn.hotelservice.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomTypeRequestDto {

    @NotNull
    private String type; // STANDARD, DELUXE, SUITE

    @NotNull
    private BigDecimal pricePerNight;

    @NotNull
    private Integer totalRooms;

    @NotNull
    private Integer capacity;

    private String amenities;
}
