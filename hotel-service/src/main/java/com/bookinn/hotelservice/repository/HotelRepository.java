package com.bookinn.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinn.hotelservice.entity.Hotel;
import com.bookinn.hotelservice.entity.HotelStatus;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByCityIgnoreCaseAndStatus(String city, HotelStatus status);

    List<Hotel> findByStatus(HotelStatus status);
}
