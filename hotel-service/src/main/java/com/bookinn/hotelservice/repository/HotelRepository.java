package com.bookinn.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.HotelStatus;
import java.math.BigDecimal;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByCityIgnoreCaseAndStatus(String city, HotelStatus status);

    List<Hotel> findByStatus(HotelStatus status);

    List<Hotel> findByNameContainingIgnoreCaseAndStatus(String name, HotelStatus status);

    List<Hotel> findByCityContainingIgnoreCaseAndStateContainingIgnoreCaseAndStatus(String city, String state,
            HotelStatus status);

    List<Hotel> findDistinctByRoomTypes_PricePerNightLessThanEqualAndStatus(BigDecimal maxPrice, HotelStatus status);

    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.roomTypes rt WHERE h.status = 'ACTIVE' ORDER BY MIN(rt.pricePerNight) ASC")
    List<Hotel> findAllOrderByPriceAsc();

    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.roomTypes rt WHERE h.status = 'ACTIVE' ORDER BY MIN(rt.pricePerNight) DESC")
    List<Hotel> findAllOrderByPriceDesc();

    List<Hotel> findByStatusOrderByStarRatingDesc(HotelStatus status);

    List<Hotel> findByStarRatingAndStatus(Integer starRating, HotelStatus status);

    List<Hotel> findAllByStatusOrderByStarRatingDesc(HotelStatus status);
}
