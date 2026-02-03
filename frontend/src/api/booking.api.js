import api from "./axios";

export const createBooking = (bookingData) => api.post("/bookings/book_hotel", bookingData);

export const getMyBookings = () => api.get("/bookings/me");

export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);

export const getBookingsByHotel = (hotelId) => api.get(`/bookings/manager/hotel/${hotelId}`);

export const getBookingForHotel = (hotelId, bookingId) =>
  api.get(`/bookings/manager/hotel/${hotelId}/booking/${bookingId}`);

// Admin Endpoints
export const getAllBookings = () => api.get("/bookings/admin/all");
export const getBookingsByUser = (userId) => api.get(`/bookings/admin/user/${userId}`);
