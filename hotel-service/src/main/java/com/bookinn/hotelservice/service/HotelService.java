package com.bookinn.hotelservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.HotelStatus;
import com.bookinn.hotelservice.exception.HotelNotFoundException;
import com.bookinn.hotelservice.repository.HotelRepository;
import com.bookinn.hotelservice.repository.RoomTypeRepository;
import com.bookinn.hotelservice.dto.RoomTypeWithHotelDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;

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

    // ADMIN
    public Hotel enableHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + hotelId));

        hotel.setStatus(HotelStatus.ACTIVE);
        return hotelRepository.save(hotel);
    }

    // ADMIN
    public List<Hotel> getInactiveHotels() {
        return hotelRepository.findByStatus(HotelStatus.INACTIVE);
    }

    // ADMIN: Add Images
    public Hotel addImages(Long hotelId, List<String> imageUrls) {
        Hotel hotel = getHotelById(hotelId);
        if (hotel.getImages() == null) {
            hotel.setImages(new java.util.ArrayList<>());
        }
        hotel.getImages().addAll(imageUrls);
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

    // PUBLIC: Search by Name
    public List<Hotel> searchHotelsByName(String name) {
        return hotelRepository.findByNameContainingIgnoreCaseAndStatus(name, HotelStatus.ACTIVE);
    }

    // PUBLIC: Search by City & State
    public List<Hotel> searchHotelsByLocation(String city, String state) {
        return hotelRepository.findByCityContainingIgnoreCaseAndStateContainingIgnoreCaseAndStatus(city, state,
                HotelStatus.ACTIVE);
    }

    // PUBLIC: Filter by Price
    public List<Hotel> filterHotelsByPrice(java.math.BigDecimal maxPrice) {
        return hotelRepository.findDistinctByRoomTypes_PricePerNightLessThanEqualAndStatus(maxPrice,
                HotelStatus.ACTIVE);
    }

    // PUBLIC: Filter Room Types by Price
    public List<RoomTypeWithHotelDTO> filterRoomTypesByPrice(java.math.BigDecimal maxPrice) {
        return roomTypeRepository.findByHotel_StatusAndPricePerNightLessThanEqual(HotelStatus.ACTIVE, maxPrice)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // INTERNAL / BOOKING
    public Hotel getHotelById(Long hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + hotelId));
    }

    // PUBLIC: Sort by Price
    public List<Hotel> getHotelsSortedByPrice(boolean ascending) {
        if (ascending) {
            return hotelRepository.findAllOrderByPriceAsc();
        } else {
            return hotelRepository.findAllOrderByPriceDesc();
        }
    }

    // PUBLIC: Sort Room Types by Price Low -> High
    public List<RoomTypeWithHotelDTO> getRoomTypesSortedByPriceLowToHigh() {
        return roomTypeRepository.findByHotel_StatusOrderByPricePerNightAsc(HotelStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // PUBLIC: Sort Room Types by Price High -> Low
    public List<RoomTypeWithHotelDTO> getRoomTypesSortedByPriceHighToLow() {
        return roomTypeRepository.findByHotel_StatusOrderByPricePerNightDesc(HotelStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private RoomTypeWithHotelDTO mapToDTO(com.bookinn.hotelservice.entity.RoomType roomType) {
        RoomTypeWithHotelDTO dto = new RoomTypeWithHotelDTO();
        dto.setRoomTypeId(roomType.getRoomTypeId());
        dto.setType(roomType.getType());
        dto.setPricePerNight(roomType.getPricePerNight());
        dto.setTotalRooms(roomType.getTotalRooms());
        dto.setCapacity(roomType.getCapacity());
        dto.setAmenities(roomType.getAmenities());
        dto.setDescription(roomType.getDescription());

        if (roomType.getHotel() != null) {
            dto.setHotelId(roomType.getHotel().getHotelId());
            dto.setHotelName(roomType.getHotel().getName());
            dto.setCity(roomType.getHotel().getCity());
            dto.setState(roomType.getHotel().getState());
            dto.setHotelImage(roomType.getHotel().getImageUrl());
        }
        return dto;
    }

    // PUBLIC: Sort by Rating
    public List<Hotel> getHotelsSortedByRating() {
        return hotelRepository.findByStatusOrderByStarRatingDesc(HotelStatus.ACTIVE);
    }
}
