# Manager API Endpoints

This document lists all server endpoints that are accessible to the Manager role, with URLs as exposed via the API Gateway.

## Base URL
- http://localhost:8080/api

## Booking Service
- GET /bookings/manager/hotel/{hotelId} — Access: MANAGER — View all bookings for a specific hotel
- GET /bookings/manager/hotel/{hotelId}/booking/{bookingId} — Access: MANAGER — View a specific booking that belongs to the given hotel

## User Service
- GET /users/get/{id} — Access: MANAGER — Get user details by user ID

