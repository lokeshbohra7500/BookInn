package com.bookinn.hotelservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.RoomType;
import com.bookinn.hotelservice.exception.HotelNotFoundException;
import com.bookinn.hotelservice.exception.RoomTypeNotFoundException;
import com.bookinn.hotelservice.repository.HotelRepository;
import com.bookinn.hotelservice.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;

    // ADMIN
    public RoomType addRoomType(Long hotelId, RoomType roomType) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() ->
                        new HotelNotFoundException("Hotel not found with id: " + hotelId));

        roomType.setHotel(hotel);
        return roomTypeRepository.save(roomType);
    }

    // PUBLIC
    public List<RoomType> getRoomTypesByHotel(Long hotelId) {
        return roomTypeRepository.findByHotel_HotelId(hotelId);
    }

    // INTERNAL / BOOKING
    public RoomType getRoomTypeById(Long roomTypeId) {
        return roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() ->
                        new RoomTypeNotFoundException("RoomType not found with id: " + roomTypeId));
    }
}
