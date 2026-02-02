package com.bookinn.hotelservice.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bookinn.hotelservice.dto.HotelRequestDto;
import com.bookinn.hotelservice.dto.RoomTypeRequestDto;
import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.RoomCategory;
import com.bookinn.hotelservice.entity.RoomType;
import com.bookinn.hotelservice.service.HotelService;
import com.bookinn.hotelservice.service.RoomTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hotels/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHotelController {

        private final HotelService hotelService;
        private final RoomTypeService roomTypeService;

        // ➕ Add Hotel
        @PostMapping("/add")
        public ResponseEntity<Hotel> addHotel(
                        @Valid @RequestBody HotelRequestDto dto) {

                Hotel hotel = new Hotel();
                hotel.setName(dto.getName());
                hotel.setCity(dto.getCity());
                hotel.setState(dto.getState());
                hotel.setAddress(dto.getAddress());
                hotel.setDescription(dto.getDescription());
                hotel.setStarRating(dto.getStarRating());
                hotel.setImageUrl(dto.getImageUrl());

                return new ResponseEntity<>(
                                hotelService.addHotel(hotel),
                                HttpStatus.CREATED);
        }

        // 🚫 Disable Hotel
        @PatchMapping("/{hotelId}/disable")
        public ResponseEntity<Hotel> disableHotel(
                        @PathVariable("hotelId") Long hotelId) {

                return ResponseEntity.ok(
                                hotelService.disableHotel(hotelId));
        }

        // ➕ Add RoomType to Hotel
        @PostMapping("/{hotelId}/room-types")
        public ResponseEntity<RoomType> addRoomType(
                        @PathVariable("hotelId") Long hotelId,
                        @Valid @RequestBody RoomTypeRequestDto dto) {

                RoomType roomType = new RoomType();
                roomType.setType(RoomCategory.valueOf(dto.getType()));
                roomType.setPricePerNight(dto.getPricePerNight());
                roomType.setTotalRooms(dto.getTotalRooms());
                roomType.setCapacity(dto.getCapacity());
                roomType.setAmenities(dto.getAmenities());

                return new ResponseEntity<>(
                                roomTypeService.addRoomType(hotelId, roomType),
                                HttpStatus.CREATED);
        }
}
