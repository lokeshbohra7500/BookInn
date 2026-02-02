import api from "./axios";

export const getAllHotels = () => api.get("/hotels/public");

export const getHotelsByCity = (city) => api.get(`/hotels/public/city/${city}`);

export const searchHotelsByName = (name) => api.get(`/hotels/public/search/name?name=${name}`);

export const sortHotelsByRating = () => api.get("/hotels/public/sort/rating");

export const searchRoomsUnderPrice = (maxPrice) => api.get(`/hotels/public/search/price?maxPrice=${maxPrice}`);

export const sortRoomsPriceLowToHigh = () => api.get("/hotels/public/sort/price/low-to-high");
export const sortRoomsPriceHighToLow = () => api.get("/hotels/public/sort/price/high-to-low");

export const getHotelRoomTypes = (hotelId) => api.get(`/hotels/public/${hotelId}/room-types`);
