package com.bookinn.hotelservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinn.hotelservice.dto.HotelRoomPriceResponse;
import com.bookinn.hotelservice.entity.RoomType;
import com.bookinn.hotelservice.exception.RoomTypeNotFoundException;
import com.bookinn.hotelservice.service.RoomTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hotels/internal")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
public class HotelInternalController {

    private final RoomTypeService roomTypeService;

    /**
     * INTERNAL endpoint for booking-service
     *
     * Path variables:
     * hotelId -> Hotel.hotelId
     * roomTypeId -> RoomType.roomTypeId
     */
    @GetMapping("/{hotelId}/room-types/{roomTypeId}/price")
    public HotelRoomPriceResponse getRoomPrice(
            @PathVariable("hotelId") Long hotelId,
            @PathVariable("roomTypeId") Long roomTypeId) {

        RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);

        // 🔒 Safety check: room must belong to given hotel
        if (!roomType.getHotel().getHotelId().equals(hotelId)) {
            throw new RoomTypeNotFoundException(
                    "RoomType does not belong to hotelId: " + hotelId);
        }

        HotelRoomPriceResponse response = new HotelRoomPriceResponse();
        response.setHotelId(hotelId);
        response.setRoomTypeId(roomTypeId);
        response.setPricePerNight(roomType.getPricePerNight());
        response.setTotalRooms(roomType.getTotalRooms());

        return response;
    }
}
