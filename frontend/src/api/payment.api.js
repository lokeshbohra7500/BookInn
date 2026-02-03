import axios from "axios";

const paymentApi = axios.create({
    baseURL: "http://localhost:8084",
});

// Add token to headers manually since this is a separate instance
paymentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const initiatePayment = (bookingId) => paymentApi.post("/payments/initiate", { bookingId });

export const verifyPayment = (paymentData) => paymentApi.post("/payments/verify", paymentData);

export const getAllPayments = () => paymentApi.get("/payments/admin/all");
