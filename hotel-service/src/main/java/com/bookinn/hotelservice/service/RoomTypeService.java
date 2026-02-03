package com.bookinn.hotelservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinn.hotelservice.dto.RoomWithHotelResponse;
import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.RoomType;
import com.bookinn.hotelservice.exception.HotelNotFoundException;
import com.bookinn.hotelservice.exception.RoomTypeNotFoundException;
import com.bookinn.hotelservice.repository.HotelRepository;
import com.bookinn.hotelservice.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;

    // ADMIN
    public RoomType addRoomType(Long hotelId, RoomType roomType) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + hotelId));

        roomType.setHotel(hotel);
        return roomTypeRepository.save(roomType);
    }

    // PUBLIC
    public List<RoomType> getRoomTypesByHotel(Long hotelId) {
        return roomTypeRepository.findByHotel_HotelId(hotelId);
    }

    // PUBLIC
    public List<RoomWithHotelResponse> getRoomsUnderPrice(BigDecimal maxPrice) {
        return roomTypeRepository.findByPricePerNightLessThanEqual(maxPrice)
                .stream()
                .map(this::mapToRoomWithHotelResponse)
                .collect(Collectors.toList());
    }

    // PUBLIC
    public List<RoomWithHotelResponse> getRoomsSortedByPrice(String direction) {
        List<RoomType> rooms;
        if ("desc".equalsIgnoreCase(direction)) {
            rooms = roomTypeRepository.findAllByOrderByPricePerNightDesc();
        } else {
            rooms = roomTypeRepository.findAllByOrderByPricePerNightAsc();
        }
        return rooms.stream()
                .map(this::mapToRoomWithHotelResponse)
                .collect(Collectors.toList());
    }

    public List<RoomWithHotelResponse> getRoomsSortedByRating() {
        return roomTypeRepository.findAllByOrderByHotel_StarRatingDesc()
                .stream()
                .map(this::mapToRoomWithHotelResponse)
                .collect(Collectors.toList());
    }

    private RoomWithHotelResponse mapToRoomWithHotelResponse(RoomType roomType) {
        Hotel hotel = roomType.getHotel();
        RoomWithHotelResponse response = new RoomWithHotelResponse();

        // Room Info
        response.setRoomTypeId(roomType.getRoomTypeId());
        response.setType(roomType.getType().name());
        response.setPricePerNight(roomType.getPricePerNight());
        response.setTotalRooms(roomType.getTotalRooms());
        response.setCapacity(roomType.getCapacity());
        response.setAmenities(roomType.getAmenities());
        // Note: Adding description here too
        response.setDescription("Room in " + hotel.getName()); // Placeholder if RoomType doesn't have it

        // Hotel Info
        response.setHotelId(hotel.getHotelId());
        response.setHotelName(hotel.getName());
        response.setCity(hotel.getCity());
        response.setState(hotel.getState());
        response.setAddress(hotel.getAddress());
        response.setHotelImage(hotel.getImageUrl());
        response.setStarRating(hotel.getStarRating());

        return response;
    }

    // INTERNAL / BOOKING
    public RoomWithHotelResponse getRoomWithHotel(Long roomTypeId) {
        RoomType roomType = getRoomTypeById(roomTypeId);
        return mapToRoomWithHotelResponse(roomType);
    }

    public RoomType getRoomTypeById(Long roomTypeId) {
        return roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("RoomType not found with id: " + roomTypeId));
    }
}
