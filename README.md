# BookInn - Hotel Booking Microservices Application

A microservices-based hotel booking platform similar to OYO and BookMyRoom, built with Java Spring Boot, Spring Security, React, and Maven.

## Architecture

This project follows a microservices architecture with the following services:

1. **User Service** (Port: 8081) - Handles user registration, authentication, and user management
2. **Hotel Service** (Port: 8082) - Manages hotel information, rooms, and availability
3. **Booking Service** (Port: 8083) - Handles booking creation, modification, and cancellation
4. **Payment Service** (Port: 8084) - Processes payments and payment transactions

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - For authentication and authorization
- **Spring Data JPA** - For database operations
- **MySQL Database** - For data persistence
- **Maven** - Build tool

### Frontend
- **React 18.2.0**
- **React Router** - For navigation
- **Axios** - For API calls

## Project Structure

```
BookInn/
├── pom.xml                          # Parent POM
├── user-service/                    # User microservice
│   ├── pom.xml
│   └── src/
├── hotel-service/                   # Hotel microservice
│   ├── pom.xml
│   └── src/
├── booking-service/                 # Booking microservice
│   ├── pom.xml
│   └── src/
├── payment-service/                 # Payment microservice
│   ├── pom.xml
│   └── src/
└── frontend/                        # React frontend
    ├── package.json
    └── src/
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (installed and running)
- Node.js 16+ and npm (for frontend)
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Backend Setup

1. **MySQL Database Setup:**
   
   Ensure MySQL is running on `localhost:3306` with username `root` and password `root`.
   
   The databases will be created automatically when services start (if they don't exist):
   - `DbUser` - for user-service
   - `DbHotel` - for hotel-service
   - `DbBooking` - for booking-service
   - `DbPayment` - for payment-service
   
   Alternatively, you can create them manually:
   ```sql
   CREATE DATABASE IF NOT EXISTS DbUser;
   CREATE DATABASE IF NOT EXISTS DbHotel;
   CREATE DATABASE IF NOT EXISTS DbBooking;
   CREATE DATABASE IF NOT EXISTS DbPayment;
   ```

2. **Build all services:**
   ```bash
   mvn clean install
   ```

3. **Run individual services:**
   
   User Service:
   ```bash
   cd user-service
   mvn spring-boot:run
   ```
   
   Hotel Service:
   ```bash
   cd hotel-service
   mvn spring-boot:run
   ```
   
   Booking Service:
   ```bash
   cd booking-service
   mvn spring-boot:run
   ```
   
   Payment Service:
   ```bash
   cd payment-service
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000

## Service Ports

| Service | Port |
|---------|------|
| User Service | 8081 |
| Hotel Service | 8082 |
| Booking Service | 8083 |
| Payment Service | 8084 |
| Frontend | 3000 |

## Next Steps

1. **Implement Domain Models:**
   - Create entities for User, Hotel, Room, Booking, Payment
   - Set up relationships between entities

2. **Implement REST APIs:**
   - Create controllers for each service
   - Implement CRUD operations
   - Add validation and error handling

3. **Implement Security:**
   - Configure Spring Security for each service
   - Implement JWT authentication
   - Set up role-based access control

4. **Service Communication:**
   - Implement inter-service communication (REST or messaging)
   - Add service discovery (Eureka/Consul)
   - Implement API Gateway

5. **Database:**
   - Set up database migrations (Flyway or Liquibase)
   - Configure connection pooling for production

6. **Frontend Development:**
   - Create components for hotel listing, booking, user dashboard
   - Implement authentication flow
   - Add state management (Redux/Context API)

## Development Notes

- Each microservice has its own MySQL database (DbUser, DbHotel, DbBooking, DbPayment)
- MySQL connection: `root@localhost:3306`
- Databases are auto-created if they don't exist (via `createDatabaseIfNotExist=true`)
- Spring Security is included but not fully configured yet
- Services are currently independent - inter-service communication to be implemented

## License

This project is for educational purposes.
