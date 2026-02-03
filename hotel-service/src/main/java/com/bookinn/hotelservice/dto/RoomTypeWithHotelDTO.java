package com.bookinn.hotelservice.dto;

import java.math.BigDecimal;
import com.bookinn.hotelservice.entity.RoomCategory;
import lombok.Data;

@Data
public class RoomTypeWithHotelDTO {
    private Long roomTypeId;
    private RoomCategory type;
    private BigDecimal pricePerNight;
    private Integer totalRooms;
    private Integer capacity;
    private String amenities;
    private String description;

    private Long hotelId;
    private String hotelName;
    private String city;
    private String state;
    private String hotelImage;
}
