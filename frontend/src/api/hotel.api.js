import api from "./axios";

export const getAllHotels = () => api.get("/hotels/public");

export const getHotelsByCity = (city) => api.get(`/hotels/public/city/${city}`);

export const searchHotelsByName = (name) => api.get(`/hotels/public/search/name?name=${name}`);

export const sortHotelsByRating = () => api.get("/hotels/public/sort/rating");

export const searchRoomsUnderPrice = (maxPrice) => api.get(`/hotels/public/search/price?maxPrice=${maxPrice}`);

export const sortRoomsPriceLowToHigh = () => api.get("/hotels/public/sort/price/low-to-high");
export const sortRoomsPriceHighToLow = () => api.get("/hotels/public/sort/price/high-to-low");

export const getHotelRoomTypes = (hotelId) => api.get(`/hotels/public/${hotelId}/room-types`);

// Admin Endpoints
export const addHotel = (hotelData) => api.post("/hotels/admin/add", hotelData);
export const disableHotel = (hotelId) => api.patch(`/hotels/admin/${hotelId}/disable`);
export const addRoomType = (hotelId, roomTypeData) => api.post(`/hotels/admin/${hotelId}/room-types`, roomTypeData);
export const addHotelImages = (hotelId, imageUrls) => api.post(`/hotels/admin/${hotelId}/images`, imageUrls);
export const getInactiveHotels = () => api.get("/hotels/admin/inactive");
export const enableHotel = (hotelId) => api.patch(`/hotels/admin/${hotelId}/enable`);
