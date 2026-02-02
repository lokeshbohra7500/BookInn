package com.bookinn.hotelservice.dto;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomWithHotelResponse {
    private Long roomTypeId;
    private String type;
    private BigDecimal pricePerNight;
    private Integer totalRooms;
    private Integer capacity;
    private String amenities;
    private String description;

    private Long hotelId;
    private String hotelName;
    private String city;
    private String state;
    private String address;
    private String hotelImage;
    private Integer starRating;
}
