package com.bookinn.bookingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bookinn.bookingservice.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    boolean existsByBookingIdAndUserId(Long bookingId, Long userId);

	List<Booking> findByHotelId(Long hotelId);
}
