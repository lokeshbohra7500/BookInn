import api from "./axios";

export const createBooking = (bookingData) => api.post("/bookings/book_hotel", bookingData);

export const getMyBookings = () => api.get("/bookings/me");

export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);
