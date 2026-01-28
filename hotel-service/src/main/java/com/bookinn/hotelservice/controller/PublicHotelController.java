package com.bookinn.hotelservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.RoomType;
import com.bookinn.hotelservice.service.HotelService;
import com.bookinn.hotelservice.service.RoomTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hotels/public")
@RequiredArgsConstructor
public class PublicHotelController {

    private final HotelService hotelService;
    private final RoomTypeService roomTypeService;

    // 🌍 Get all active hotels
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(
                hotelService.getAllActiveHotels()
        );
    }

    // 🌍 Get hotels by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Hotel>> getHotelsByCity(
            @PathVariable("city") String city) {

        return ResponseEntity.ok(
                hotelService.getHotelsByCity(city)
        );
    }

    // 🏨 Get room types for a hotel
    @GetMapping("/{hotelId}/room-types")
    public ResponseEntity<List<RoomType>> getRoomTypes(
            @PathVariable("hotelId") Long hotelId) {

        return ResponseEntity.ok(
                roomTypeService.getRoomTypesByHotel(hotelId)
        );
    }
}
