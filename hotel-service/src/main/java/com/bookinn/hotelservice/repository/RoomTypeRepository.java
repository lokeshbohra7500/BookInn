package com.bookinn.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinn.hotelservice.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    List<RoomType> findByHotel_HotelId(Long hotelId);
}
