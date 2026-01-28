package com.bookinn.bookingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bookinn.bookingservice.dto.HotelRoomPriceResponse;

@FeignClient(name = "HOTEL-SERVICE")
public interface HotelServiceClient {

    @GetMapping("/hotels/internal/{hotelId}/room-types/{roomTypeId}/price")
    HotelRoomPriceResponse getRoomPrice(
            @PathVariable("hotelId") Long hotelId,
            @PathVariable("roomTypeId") Long roomTypeId
    );
}
