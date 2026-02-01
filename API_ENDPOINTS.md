# 📖 API Endpoints Reference

This document provides a comprehensive list of all endpoints available in the BookInn Microservices ecosystem.

---

## 🛰️ API Gateway (Port: 8080)
All external requests should go through the Gateway using the prefix `/api`.

| Service | Sub-Path | Direct Port |
| :--- | :--- | :--- |
| **User Service** | `/api/users/**`, `/api/auth/**` | 8081 |
| **Hotel Service** | `/api/hotels/**` | 8082 |
| **Booking Service** | `/api/bookings/**` | 8083 |
| **Payment Service** | `/api/payments/**` | 8084 |

---

## 👤 User Service
**Base URL**: `http://localhost:8080/api`

### Authentication
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | **Public** | Authenticate user & get JWT |
| `POST` | `/users/register` | **Public** | Register a new user |

### User Management
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | `CUSTOMER`, `ADMIN` | Get current logged-in user profile |
| `PUT` | `/users/update` | `CUSTOMER`, `ADMIN` | Update profile (Firstname, Lastname, etc.) |
| `GET` | `/users/get/{id}` | `MANAGER`, `ADMIN` | Get user details by ID |
| `GET` | `/users/all` | `ADMIN` | List all registered users |

---

## 🏨 Hotel Service
**Base URL**: `http://localhost:8080/api/hotels`

### Public Endpoints
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/public` | **Public** | List all active hotels |
| `GET` | `/public/city/{city}` | **Public** | Search hotels by city name |
| `GET` | `/public/{hotelId}/room-types` | **Public** | Get available room categories for a hotel |

### Admin Endpoints
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/add` | `ADMIN` | Add a new hotel to the system |
| `PATCH` | `/admin/{hotelId}/disable` | `ADMIN` | Deactivate a hotel (Logical delete) |
| `POST` | `/admin/{hotelId}/room-types` | `ADMIN` | Add a room category (pricing, capacity) |

### 🛠️ Internal (Service-to-Service)
| Method | Path | Access | Caller |
| :--- | :--- | :--- | :--- |
| `GET` | `/internal/{hId}/room-types/{rtId}/price` | `Internal` | `booking-service` (via Feign) |

---

## 📅 Booking Service
**Base URL**: `http://localhost:8080/api/bookings`

### Customer Flow
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/book_hotel` | `CUSTOMER`, `ADMIN` | Create a booking (validates room availability) |
| `GET` | `/me` | `CUSTOMER`, `ADMIN` | List all bookings made by current user |
| `GET` | `/{bookingId}` | `CUSTOMER`, `ADMIN` | Get specific booking details |
| `DELETE` | `/{bookingId}` | `CUSTOMER`, `ADMIN` | Cancel a booking |

### Manager & Admin
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/manager/hotel/{hotelId}` | `MANAGER`, `ADMIN` | View all bookings for a specific hotel |
| `GET` | `/admin/all` | `ADMIN` | View ALL bookings in the system |
| `GET` | `/admin/user/{userId}` | `ADMIN` | View all bookings for a specific user |

### 🛠️ Internal (Service-to-Service)
| Method | Path | Access | Caller |
| :--- | :--- | :--- | :--- |
| `PUT` | `/{bookingId}/payment-success` | **Public*** | `payment-service` (Webhook/Sync) |
> [!NOTE]
> *This endpoint is permitted without JWT to allow asynchronous updates from Webhooks.

---

## 💳 Payment Service
**Base URL**: `http://localhost:8080/api/payments`

### Payment Flow
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/initiate` | `CUSTOMER` | Create Razorpay Order ID for a booking |
| `POST` | `/verify` | `CUSTOMER` | Verify Razorpay Signature after payment |

### 🛠️ External (Webhooks)
| Method | Path | Access | Caller |
| :--- | :--- | :--- | :--- |
| `POST` | `/webhook` | **Public** | Razorpay Server (Signature verified) |
