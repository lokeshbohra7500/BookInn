# 🛠️ Admin API Reference - BookInn

This document provides a detailed reference for all **Admin** and **Manager** endpoints in the BookInn Microservices ecosystem, including JSON request and response structures.

---

## 🔑 Authentication
All admin requests must include a valid JWT in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

### 🚪 Login (Get Admin Token)
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public

**Request Body:**
```json
{
  "email": "admin@bookinn.com",
  "password": "securepassword"
}
```

**Response Body:**
```json
{
  "token": "eyJhbG...",
  "userId": 1,
  "email": "admin@bookinn.com",
  "role": "ADMIN"
}
```

---

## 👤 User Management (User Service)
**Base URL:** `http://localhost:8080/api/users`

### 📋 List All Users
- **Endpoint:** `GET /all`
- **Access:** `ADMIN`

**Response Body:**
```json
[
  {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  {
    "userId": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "city": "Delhi",
    "state": "Delhi"
  }
]
```

### 🔍 Get User by ID
- **Endpoint:** `GET /get/{id}`
- **Access:** `ADMIN`, `MANAGER`

**Response Body:**
```json
{
  "userId": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "city": "Delhi",
  "state": "Delhi"
}
```

---

## 🏨 Hotel & Room Management (Hotel Service)
**Base URL:** `http://localhost:8080/api/hotels/admin`

### ➕ Add New Hotel
- **Endpoint:** `POST /add`
- **Access:** `ADMIN`

**Request Body:**
```json
{
  "name": "Luxury Inn",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Marine Drive",
  "description": "A high-end luxury hotel with sea-facing views.",
  "starRating": 5,
  "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945"
}
```

**Response Body:**
```json
{
  "hotelId": 1,
  "name": "Luxury Inn",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Marine Drive",
  "description": "A high-end luxury hotel with sea-facing views.",
  "starRating": 5,
  "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "status": "ACTIVE"
}
```

### 🚫 Disable Hotel
- **Endpoint:** `PATCH /{hotelId}/disable`
- **Access:** `ADMIN`

**Response Body:**
```json
{
  "hotelId": 1,
  "name": "Luxury Inn",
  "status": "DISABLED"
}
```

### 🛏️ Add Room Type to Hotel
- **Endpoint:** `POST /{hotelId}/room-types`
- **Access:** `ADMIN`

**Request Body:**
```json
{
  "type": "DELUXE",
  "pricePerNight": 4500.00,
  "totalRooms": 20,
  "capacity": 2,
  "amenities": "WiFi, AC, Television, Mini Fridge"
}
```

**Response Body:**
```json
{
  "roomTypeId": 5,
  "type": "DELUXE",
  "pricePerNight": 4500.00,
  "totalRooms": 20,
  "capacity": 2,
  "amenities": "WiFi, AC, Television, Mini Fridge"
}
```

### 🖼️ Bulk Add Hotel Images
- **Endpoint:** `POST /{hotelId}/images`
- **Access:** `ADMIN`

**Request Body:**
```json
[
  "https://example.com/img1.jpg",
  "https://example.com/img2.jpg"
]
```

---

## 📅 Booking Management (Booking Service)
**Base URL:** `http://localhost:8080/api/bookings`

### 🌍 View All Bookings (Global)
- **Endpoint:** `GET /admin/all`
- **Access:** `ADMIN`

**Response Body:**
```json
[
  {
    "bookingId": 101,
    "userId": 5,
    "hotelId": 1,
    "roomTypeId": 5,
    "checkInDate": "2026-03-10",
    "checkOutDate": "2026-03-12",
    "numberOfRooms": 1,
    "numberOfGuests": 2,
    "totalAmount": 9000.00,
    "status": "CONFIRMED",
    "hotelName": "Luxury Inn",
    "city": "Mumbai",
    "roomTypeName": "DELUXE"
  }
]
```

### 👤 View Bookings by User ID
- **Endpoint:** `GET /admin/user/{userId}`
- **Access:** `ADMIN`

**Response Body:**
```json
[
  {
    "bookingId": 101,
    "userId": 5,
    "totalAmount": 9000.00,
    "status": "CONFIRMED",
    "hotelName": "Luxury Inn"
  }
]
```

### 🏨 View Bookings for Specific Hotel
- **Endpoint:** `GET /manager/hotel/{hotelId}`
- **Access:** `MANAGER`, `ADMIN`

**Response Body:**
```json
[
  {
    "bookingId": 101,
    "userId": 5,
    "roomTypeName": "DELUXE",
    "checkInDate": "2026-03-10",
    "status": "CONFIRMED"
  }
]
```
