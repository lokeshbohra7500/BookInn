import api from "./axios";

export const getMe = () => api.get("/users/me");

export const getUserById = (id) => api.get(`/users/get/${id}`);

export const getAllUsers = () => api.get("/users/all");

export const registerUser = (userData) => api.post("/users/register", userData);
