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

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(b.numberOfRooms), 0) FROM Booking b WHERE b.hotelId = :hotelId AND b.roomTypeId = :roomTypeId AND b.status != 'CANCELLED' AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
    Long countConflictingBookings(
            @org.springframework.data.repository.query.Param("hotelId") Long hotelId,
            @org.springframework.data.repository.query.Param("roomTypeId") Long roomTypeId,
            @org.springframework.data.repository.query.Param("checkInDate") java.time.LocalDate checkInDate,
            @org.springframework.data.repository.query.Param("checkOutDate") java.time.LocalDate checkOutDate);

    List<Booking> findByStatusAndCreatedAtBefore(com.bookinn.bookingservice.entity.BookingStatus status,
            java.time.LocalDateTime dateTime);
}
