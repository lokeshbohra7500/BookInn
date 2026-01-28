package com.bookinn.bookingservice.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelRoomPriceResponse {

    private Long hotelId;
    private Long roomTypeId;
    private BigDecimal pricePerNight;
}
