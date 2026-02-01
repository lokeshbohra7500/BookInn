package com.bookinn.hotelservice.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelRoomPriceResponse {

    // maps to Hotel.hotelId
    private Long hotelId;

    // maps to RoomType.roomTypeId
    private Long roomTypeId;

    // actual price used by booking-service
    private BigDecimal pricePerNight;
    private Integer totalRooms;
}
