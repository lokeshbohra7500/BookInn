package com.bookinn.bookingservice.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.bookinn.bookingservice.entity.Booking;
import com.bookinn.bookingservice.entity.BookingStatus;
import com.bookinn.bookingservice.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000) // Run every minute
    public void cancelUnpaidBookings() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository.findByStatusAndCreatedAtBefore(BookingStatus.PENDING,
                cutoffTime);

        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired bookings. Cancelling...", expiredBookings.size());
            for (Booking booking : expiredBookings) {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            }
        }
    }
}
