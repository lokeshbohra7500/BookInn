package com.bookinn.bookingservice.service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinn.bookingservice.client.HotelServiceClient;
import com.bookinn.bookingservice.dto.BookingResponseDto;
import com.bookinn.bookingservice.dto.CreateBookingRequestDto;
import com.bookinn.bookingservice.dto.HotelRoomPriceResponse;
import com.bookinn.bookingservice.entity.Booking;
import com.bookinn.bookingservice.entity.BookingStatus;
import com.bookinn.bookingservice.exception.AccessDeniedException;
import com.bookinn.bookingservice.exception.BadRequestException;
import com.bookinn.bookingservice.exception.InvalidStateException;
import com.bookinn.bookingservice.exception.ResourceNotFoundException;
import com.bookinn.bookingservice.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelServiceClient hotelServiceClient; // 👈 NEW

    /*
     * =========================================================
     * CUSTOMER / ADMIN
     * CREATE BOOKING
     * =========================================================
     */
    public BookingResponseDto createBooking(CreateBookingRequestDto request, Long userId) {

        // ---- validation ----
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        long nights = ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate());

        if (nights < 1) {
            throw new BadRequestException("Minimum stay is 1 night");
        }

        if (request.getNumberOfRooms() == null || request.getNumberOfRooms() < 1) {
            throw new BadRequestException("At least one room must be booked");
        }

        if (request.getNumberOfGuests() == null || request.getNumberOfGuests() < 1) {
            throw new BadRequestException("At least one guest is required");
        }

        // ---- REAL pricing via hotel-service (Feign) ----
        HotelRoomPriceResponse priceResponse = hotelServiceClient.getRoomPrice(
                request.getHotelId(),
                request.getRoomTypeId());

        // ---- INVENTORY CHECK ----
        boolean isAvailable = isRoomAvailable(
                request.getHotelId(),
                request.getRoomTypeId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getNumberOfRooms(),
                priceResponse.getTotalRooms());

        if (!isAvailable) {
            throw new BadRequestException(
                    "Not enough rooms available for selected dates. Some rooms might be sold out.");
        }

        BigDecimal pricePerNight = priceResponse.getPricePerNight();

        BigDecimal totalAmount = pricePerNight
                .multiply(BigDecimal.valueOf(nights))
                .multiply(BigDecimal.valueOf(request.getNumberOfRooms()));

        // ---- entity creation ----
        Booking booking = Booking.builder()
                .userId(userId)
                .hotelId(request.getHotelId())
                .roomTypeId(request.getRoomTypeId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfRooms(request.getNumberOfRooms())
                .numberOfGuests(request.getNumberOfGuests())
                .pricePerNight(pricePerNight)
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public HotelRoomPriceResponse getHotelRoomPrice(Long hotelId, Long roomTypeId) {
        return hotelServiceClient.getRoomPrice(hotelId, roomTypeId);
    }

    /**
     * Checks if a specific number of rooms are available for a given room type and
     * date range.
     * Logic: (Booked Rooms + Requested Rooms) <= Total Rooms
     */
    public boolean isRoomAvailable(Long hotelId, Long roomTypeId, java.time.LocalDate checkIn,
            java.time.LocalDate checkOut, Integer requestedRooms, Integer totalRooms) {
        if (totalRooms == null || totalRooms <= 0)
            return false;

        Long bookedRooms = bookingRepository.countConflictingBookings(
                hotelId,
                roomTypeId,
                checkIn,
                checkOut);

        return (bookedRooms + requestedRooms) <= totalRooms;
    }

    /*
     * ======================= rest of your service UNCHANGED
     * =======================
     */

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not own this booking");
        }
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not own this booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidStateException("Booking is already cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsByHotel(Long hotelId) {
        List<Booking> bookings = bookingRepository.findByHotelId(hotelId);
        if (bookings.isEmpty()) {
            throw new ResourceNotFoundException("No bookings found for hotelId: " + hotelId);
        }
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingForHotel(Long bookingId, Long hotelId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.getHotelId().equals(hotelId)) {
            throw new AccessDeniedException("Booking does not belong to this hotel");
        }
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsByUser(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        if (bookings.isEmpty()) {
            throw new ResourceNotFoundException("No bookings found for userId: " + userId);
        }
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void markBookingPaymentSuccess(Long bookingId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return; // idempotent
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }

    private Booking findBookingOrThrow(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private BookingResponseDto mapToResponse(Booking booking) {
        BookingResponseDto dto = BookingResponseDto.builder()
                .bookingId(booking.getBookingId())
                .userId(booking.getUserId())
                .hotelId(booking.getHotelId())
                .roomTypeId(booking.getRoomTypeId())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .numberOfRooms(booking.getNumberOfRooms())
                .numberOfGuests(booking.getNumberOfGuests())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .build();

        // Enrich with Hotel/Room Details for UI
        try {
            // Fetch full details including name, image, and location from hotel-service
            com.bookinn.bookingservice.dto.RoomWithHotelResponse fullDetails = hotelServiceClient
                    .getRoomDetails(booking.getRoomTypeId());
            dto = BookingResponseDto.builder()
                    .bookingId(dto.getBookingId())
                    .userId(dto.getUserId())
                    .hotelId(dto.getHotelId())
                    .roomTypeId(dto.getRoomTypeId())
                    .checkInDate(dto.getCheckInDate())
                    .checkOutDate(dto.getCheckOutDate())
                    .numberOfRooms(dto.getNumberOfRooms())
                    .numberOfGuests(dto.getNumberOfGuests())
                    .totalAmount(dto.getTotalAmount())
                    .status(dto.getStatus())
                    .hotelName(fullDetails.getHotelName())
                    .hotelImage(fullDetails.getHotelImage())
                    .city(fullDetails.getCity())
                    .state(fullDetails.getState())
                    .roomTypeName(fullDetails.getType())
                    .build();
        } catch (Exception e) {
            // Log error and return basic DTO if service is down
            System.err.println("Failed to fetch hotel details for booking: " + booking.getBookingId());
        }

        return dto;
    }
}
