# BookInn API Documentation - Customer & Public Endpoints

This document outlines the API endpoints available to the **Public** (unauthenticated) and **Customers** (authenticated). 

## 🔐 Authentication
BookInn uses JWT (JSON Web Token) for authentication.
- For protected endpoints, include the token in the `Authorization` header:
  `Authorization: Bearer <your_jwt_token>`

---

## � API Gateway Access
The main entry point for the entire application is the **API Gateway**.
- **Base URL:** `http://localhost:8080/api`
- All microservice endpoints are accessible via this base URL. The gateway forwards the request to the appropriate service by stripping the `/api` prefix.

---

## �🛑 Error Handling
All services return a consistent error response format called `ApiError`.

**Response (JSON):**
```json
{
  "timestamp": "2026-02-03T01:50:00.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input provided",
  "path": "/api/v1/resource"
}
```

---

## 🏛️ User Service

### 🌍 Public Endpoints

#### 1. User Registration
`POST http://localhost:8080/api/users/register`
- **Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```
- **Response:**
```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

#### 2. User Login
`POST http://localhost:8080/api/auth/login`
- **Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```
- **Response:**
```json
{
  "token": "jwt_token_here",
  "email": "john.doe@example.com",
  "userId": 1,
  "role": "CUSTOMER"
}
```

### 👤 Customer Endpoints

#### 1. Get My Profile
`GET http://localhost:8080/api/users/me`
- **Request:** N/A (Header Required)
- **Response:** `UserResponseDto` (Same as Registration)

#### 2. Update My Profile
`PUT http://localhost:8080/api/users/update`
- **Request:**
```json
{
  "firstName": "John",
  "lastName": "Updated",
  "city": "Pune",
  "state": "Maharashtra"
}
```
- **Response:** `UserResponseDto` (Same as Registration)

---

## 🏨 Hotel Service

### 🌍 Public Endpoints

#### 1. Get All Active Hotels
`GET http://localhost:8080/api/hotels/public`
- **Response:** `List<Hotel>`
```json
[
  {
    "hotelId": 1,
    "name": "Luxury Inn",
    "city": "Mumbai",
    "state": "Maharashtra",
    "address": "123 Marine Drive",
    "description": "Premium hotel with sea view",
    "starRating": 5,
    "status": "ACTIVE",
    "imageUrl": "http://image.url/h1.jpg",
    "createdAt": "2026-02-01T10:00:00"
  }
]
```

#### 2. Get Hotels by City
`GET http://localhost:8080/api/hotels/public/city/{city}`
- **Path Variable:** `city` (e.g., `Mumbai`)
- **Response:** `List<Hotel>`

#### 3. Search Hotels by Name
`GET http://localhost:8080/api/hotels/public/search/name?name={name}`
- **Query Param:** `name` (Partial name, case-insensitive)
- **Response:** `List<Hotel>`

#### 4. Filter Hotels by Rating
`GET http://localhost:8080/api/hotels/public/search/rating?rating={rating}`
- **Query Param:** `rating` (Integer, e.g., `5`)
- **Response:** `List<Hotel>`

#### 5. Search Rooms Under Price
`GET http://localhost:8080/api/hotels/public/search/price?maxPrice={maxPrice}`
- **Query Param:** `maxPrice` (e.g., `5000`)
- **Response:** `List<RoomWithHotelResponse>`
```json
[
  {
    "hotelId": 1,
    "hotelName": "Luxury Inn",
    "city": "Mumbai",
    "state": "Maharashtra",
    "address": "123 Marine Drive",
    "starRating": 5,
    "hotelImageUrl": "http://image.url/h1.jpg",
    "roomTypeId": 10,
    "roomTypeName": "DELUXE",
    "pricePerNight": 4500.00,
    "amenities": "WiFi, AC, Breakfast",
    "totalRooms": 20,
    "capacity": 2
  }
]
```

#### 6. Sort Rooms by Price
`GET http://localhost:8080/api/hotels/public/sort/price?direction={asc|desc}`
- **Query Param:** `direction` (default: `asc`)
- **Response:** `List<RoomWithHotelResponse>` (See example above)

#### 7. Get Room Types for Hotel
`GET http://localhost:8080/api/hotels/public/{hotelId}/room-types`
- **Path Variable:** `hotelId`
- **Response:** `List<RoomType>`
```json
[
  {
    "roomTypeId": 10,
    "type": "DELUXE",
    "pricePerNight": 4500.00,
    "totalRooms": 20,
    "capacity": 2,
    "amenities": "WiFi, AC, Breakfast"
  }
]
```

---

## 📅 Booking Service

### 👤 Customer Endpoints

#### 1. Create a Booking
`POST http://localhost:8080/api/bookings/book_hotel`
- **Request:**
```json
{
  "hotelId": 1,
  "roomTypeId": 10,
  "checkInDate": "2026-03-01",
  "checkOutDate": "2026-03-05",
  "numberOfRooms": 1,
  "numberOfGuests": 2
}
```
- **Response:**
```json
{
  "bookingId": 101,
  "userId": 1,
  "hotelId": 1,
  "roomTypeId": 10,
  "checkInDate": "2026-03-01",
  "checkOutDate": "2026-03-05",
  "numberOfRooms": 1,
  "numberOfGuests": 2,
  "totalAmount": 18000.00,
  "status": "PENDING"
}
```

#### 2. Get My Bookings
`GET http://localhost:8080/api/bookings/me`
- **Response:** `List<BookingResponseDto>`

#### 3. Get Booking Details
`GET http://localhost:8080/api/bookings/{bookingId}`
- **Path Variable:** `bookingId`
- **Response:** `BookingResponseDto`

#### 4. Cancel a Booking
`DELETE http://localhost:8080/api/bookings/{bookingId}`
- **Path Variable:** `bookingId`
- **Response:** `204 No Content`

---

## 💳 Payment Service

### 👤 Customer Endpoints

#### 1. Initiate Payment
`POST http://localhost:8080/api/payments/initiate`
- **Request:**
```json
{
  "bookingId": 101
}
```
- **Response:**
```json
{
  "orderId": "order_PKn9xG...",
  "amount": 18000.00,
  "currency": "INR",
  "razorpayKey": "rzp_test_..."
}
```

#### 2. Verify Payment
`POST http://localhost:8080/api/payments/verify`
- **Request:**
```json
{
  "bookingId": 101,
  "razorpayOrderId": "order_PKn9xG...",
  "razorpayPaymentId": "pay_PKn9xG...",
  "razorpaySignature": "abc123signature..."
}
```
- **Response:** `200 OK`
