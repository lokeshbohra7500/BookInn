package com.bookinn.hotelservice.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinn.hotelservice.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    List<RoomType> findByHotel_StatusAndPricePerNightLessThanEqual(com.bookinn.hotelservice.entity.HotelStatus status,
            BigDecimal price);

    List<RoomType> findByHotel_StatusOrderByPricePerNightAsc(com.bookinn.hotelservice.entity.HotelStatus status);

    List<RoomType> findByHotel_StatusOrderByPricePerNightDesc(com.bookinn.hotelservice.entity.HotelStatus status);

    List<RoomType> findByHotel_HotelId(Long hotelId);

    List<RoomType> findByPricePerNightLessThanEqual(BigDecimal price);

    List<RoomType> findAllByOrderByPricePerNightAsc();

    List<RoomType> findAllByOrderByPricePerNightDesc();

    List<RoomType> findAllByOrderByHotel_StarRatingDesc();
}
