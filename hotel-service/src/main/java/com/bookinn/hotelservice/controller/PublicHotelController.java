package com.bookinn.hotelservice.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookinn.hotelservice.dto.RoomWithHotelResponse;
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
                                hotelService.getAllActiveHotels());
        }

        // 🌍 Get hotels by city
        @GetMapping("/city/{city}")
        public ResponseEntity<List<Hotel>> getHotelsByCity(
                        @PathVariable("city") String city) {

                return ResponseEntity.ok(
                                hotelService.getHotelsByCity(city));
        }

        // 🔍 Search hotels by name
        @GetMapping("/search/name")
        public ResponseEntity<List<Hotel>> searchByName(
                        @RequestParam("name") String name) {
                return ResponseEntity.ok(
                                hotelService.searchHotelsByName(name));
        }

        // ⭐ Sort hotels by rating (descending)
        @GetMapping("/sort/rating")
        public ResponseEntity<List<Hotel>> sortByRating() {
                return ResponseEntity.ok(
                                hotelService.getHotelsSortedByRating());
        }

        // 💰 Search rooms by price (anything under entered price)
        @GetMapping("/search/price")
        public ResponseEntity<List<RoomWithHotelResponse>> searchByPrice(
                        @RequestParam("maxPrice") BigDecimal maxPrice) {
                return ResponseEntity.ok(
                                roomTypeService.getRoomsUnderPrice(maxPrice));
        }

        // ↕️ Price sorting (high to low or low to high)
        @GetMapping("/sort/price")
        public ResponseEntity<List<RoomWithHotelResponse>> sortByPrice(
                        @RequestParam(value = "direction", defaultValue = "asc") String direction) {
                return ResponseEntity.ok(
                                roomTypeService.getRoomsSortedByPrice(direction));
        }

        @GetMapping("/sort/price/low-to-high")
        public ResponseEntity<List<RoomWithHotelResponse>> sortByPriceLowToHigh() {
                return ResponseEntity.ok(
                                roomTypeService.getRoomsSortedByPrice("asc"));
        }

        @GetMapping("/sort/price/high-to-low")
        public ResponseEntity<List<RoomWithHotelResponse>> sortByPriceHighToLow() {
                return ResponseEntity.ok(
                                roomTypeService.getRoomsSortedByPrice("desc"));
        }

        // 🏨 Get room types for a hotel
        @GetMapping("/{hotelId}/room-types")
        public ResponseEntity<List<RoomType>> getRoomTypes(
                        @PathVariable("hotelId") Long hotelId) {

                return ResponseEntity.ok(
                                roomTypeService.getRoomTypesByHotel(hotelId));
        }
}
