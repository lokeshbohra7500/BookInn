package com.bookinn.hotelservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.HotelStatus;
import com.bookinn.hotelservice.exception.HotelNotFoundException;
import com.bookinn.hotelservice.repository.HotelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;

    // ADMIN
    public Hotel addHotel(Hotel hotel) {
        hotel.setStatus(HotelStatus.ACTIVE);
        return hotelRepository.save(hotel);
    }

    // ADMIN
    public Hotel disableHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + hotelId));

        hotel.setStatus(HotelStatus.INACTIVE);
        return hotelRepository.save(hotel);
    }

    // PUBLIC
    public List<Hotel> getAllActiveHotels() {
        return hotelRepository.findByStatus(HotelStatus.ACTIVE);
    }

    // PUBLIC
    public List<Hotel> getHotelsByCity(String city) {
        return hotelRepository.findByCityIgnoreCaseAndStatus(city, HotelStatus.ACTIVE);
    }

    // PUBLIC
    public List<Hotel> searchHotelsByName(String name) {
        return hotelRepository.findByNameContainingIgnoreCaseAndStatus(name, HotelStatus.ACTIVE);
    }

    // PUBLIC
    public List<Hotel> getHotelsByRating(Integer rating) {
        return hotelRepository.findByStarRatingAndStatus(rating, HotelStatus.ACTIVE);
    }

    // PUBLIC
    public List<Hotel> getHotelsSortedByRating() {
        return hotelRepository.findAllByStatusOrderByStarRatingDesc(HotelStatus.ACTIVE);
    }

    // INTERNAL / BOOKING
    public Hotel getHotelById(Long hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + hotelId));
    }
}
