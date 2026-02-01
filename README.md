# BookInn - Hotel Booking Microservices Application

A fully functional microservices-based hotel booking platform built with **Java Spring Boot 3.2**, **Spring Cloud**, **MySQL**, and **Razorpay Integration**.

---

##  Current Project Status: **STABLE & FUNCTIONAL**
The backend core flow is now fully implemented and synchronized across all services. 

###  Verified Features:
- **Centralized Gateway**: Routing and path stripping via API Gateway (Port 8080).
- **JWT Security**: Role-based access control (`ADMIN`, `MANAGER`, `CUSTOMER`) synchronized across all filters.
- **Inter-Service Communication**: Real-time pricing and inventory checks between Booking and Hotel services.
- **Payment Lifecycle**: Razorpay order initiation, signature verification, and automatic booking confirmation.
- **Auditing**: Intelligent `JwtFilter` extracting `userId` for database persistence.

---

##  Architecture & Documentation
For deep technical details, please refer to the master documentation files:

1. [**API Endpoints Reference**](./API_ENDPOINTS.md) - Full list of all 20+ rest endpoints, roles, and path variables.
2. [**Backend System Documentation**](./BACKEND_DOCUMENTATION.md) - Architecture diagrams, business logic (inventory/payments), and technical stack.

---

##  Microservices Map

| Service             | Port | Database    | Primary Responsibility |
| :---                | :--- | :---        | :---|
| **API Gateway**     | 8080 | -           | Routing, Prefix Stripping, Security Forwarding |
| **Eureka Server**   | 8761 | -           | Service Discovery & Registry |
| **User Service**    | 8081 | `DbUser`    | Registration, Login (JWT), Profiles |
| **Hotel Service**   | 8082 | `DbHotel`   | Hotel/Room Management, Price Calculation |
| **Booking Service** | 8083 | `DbBooking` | Inventory Check, Reservations, Status Lifecycle |
| **Payment Service** | 8084 | `DbPayment` | Razorpay Integration, Webhooks, Verification |

---

##  Performance & Stability Notes
- **Timeout Management**: Configured for "fast-fail" (5s-10s) to prevent cascading failures.
- **Direct Pumping**: Uses optimized port mappings for low-latency local development.
- **Inventory Safeguard**: Real-time overlap check ensures a room cannot be double-booked for the same dates.

---

## Getting Started
1. Start **Eureka Server**.
2. Start all 4 **Microservices** (order doesn't matter).
3. Start **API Gateway**.
4. Use the [**Postman Collection**](./API_ENDPOINTS.md) patterns to test the flow.

---
**Last Updated:** February 2026
