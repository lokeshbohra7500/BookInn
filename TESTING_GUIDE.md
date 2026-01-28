# Testing Guide: Eureka Server & API Gateway

## Prerequisites
Make sure all services are running in this order:
1. Eureka Server (Port 8761)
2. User Service (Port 8081)
3. Hotel Service (Port 8082)
4. Booking Service (Port 8083)
5. Payment Service (Port 8084)
6. API Gateway (Port 8080)

---

## 1. Testing Eureka Server

### Step 1: Check Eureka Dashboard
Open your browser and go to:
```
http://localhost:8761
```

### Step 2: Verify Services are Registered
You should see a table showing:
- **Application** column with service names:
  - USER-SERVICE
  - HOTEL-SERVICE
  - BOOKING-SERVICE
  - PAYMENT-SERVICE
  - API-GATEWAY (if running)

- **Status** should show "UP" for all services

### Step 3: Check Service Details
Click on any service name to see:
- Instance ID
- Status
- Port
- Health check URL

### ✅ Success Indicators:
- Dashboard loads without errors
- All services show "UP" status
- Services appear in the "Instances currently registered with Eureka" table

---

## 2. Testing API Gateway

### Step 1: Start API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

Wait for: `Started ApiGatewayApplication`

### Step 2: Verify API Gateway is Registered in Eureka
- Go to http://localhost:8761
- Check if "API-GATEWAY" appears in the services list

### Step 3: Test Routing Through API Gateway

#### Test User Service via Gateway:
```bash
# Using curl (or browser)
curl http://localhost:8080/api/users/test

# Expected Response:
{
  "message": "User Service is working!",
  "service": "user-service",
  "status": "UP",
  "timestamp": 1234567890123
}
```

#### Test Health Endpoint:
```bash
curl http://localhost:8080/api/users/health

# Expected Response:
{
  "status": "UP",
  "service": "user-service"
}
```

### Step 4: Compare Direct vs Gateway Access

**Direct Access (bypassing gateway):**
```bash
curl http://localhost:8081/users/test
```

**Through API Gateway:**
```bash
curl http://localhost:8080/api/users/test
```

Both should return the same response, but the gateway route shows it's working!

---

## 3. Testing Service Discovery

### Test: API Gateway discovers services via Eureka

The API Gateway uses `lb://user-service` which means:
- `lb` = Load Balancer (uses Eureka for service discovery)
- It finds `user-service` from Eureka registry
- Routes to the actual service instance

### Verify in Logs:
Check API Gateway logs for:
```
DiscoveryClient_API-GATEWAY/api-gateway:8761 - registration status: 204
```

Check User Service logs for:
```
DiscoveryClient_USER-SERVICE/user-service:8761 - registration status: 204
```

---

## 4. Complete Integration Test

### Test Flow:
```
Browser/Postman
    ↓
http://localhost:8080/api/users/test
    ↓
API Gateway (Port 8080)
    ↓
Discovers user-service via Eureka
    ↓
Routes to: http://user-service/users/test
    ↓
User Service (Port 8081)
    ↓
Returns JSON response
```

### Test Commands:

1. **Test through API Gateway:**
   ```bash
   curl http://localhost:8080/api/users/test
   ```

2. **Test direct access (should also work):**
   ```bash
   curl http://localhost:8081/users/test
   ```

3. **Check Eureka for service discovery:**
   - Open http://localhost:8761
   - Verify both API-GATEWAY and USER-SERVICE are registered

---

## 5. Troubleshooting

### Issue: API Gateway returns 503 or Connection Refused
**Solution:**
- Make sure Eureka Server is running
- Make sure User Service is registered in Eureka
- Check API Gateway logs for service discovery errors

### Issue: 404 Not Found through Gateway
**Solution:**
- Verify the route path in `api-gateway/application.yml`
- Check StripPrefix filter (removes `/api/users` → forwards `/users/test`)
- Ensure service endpoint exists

### Issue: Services not appearing in Eureka
**Solution:**
- Check service logs for registration errors
- Verify Eureka client configuration in `application.yml`
- Ensure services can reach Eureka Server (http://localhost:8761)

### Issue: CORS errors from frontend
**Solution:**
- API Gateway has CORS configured for `http://localhost:3000`
- Verify frontend is calling `http://localhost:8080/api/...`

---

## 6. Quick Health Check Script

Run these commands to verify everything:

```bash
# 1. Check Eureka Server
curl http://localhost:8761

# 2. Check Eureka API for registered services
curl http://localhost:8761/eureka/apps

# 3. Test User Service directly
curl http://localhost:8081/users/test

# 4. Test through API Gateway
curl http://localhost:8080/api/users/test

# 5. Test health endpoint
curl http://localhost:8080/api/users/health
```

---

## 7. Expected Results Summary

✅ **Eureka Server Working:**
- Dashboard accessible at http://localhost:8761
- All services show "UP" status
- Services appear in registry

✅ **API Gateway Working:**
- Gateway starts on port 8080
- Gateway registers with Eureka
- Routes work: `/api/users/**` → user-service
- Returns same response as direct access

✅ **Service Discovery Working:**
- Services register with Eureka automatically
- API Gateway discovers services via Eureka
- Load balancing ready (if multiple instances)

---

## Next Steps

Once everything is verified:
1. Add more endpoints to test
2. Test other services (hotel, booking, payment)
3. Test CORS from frontend
4. Add authentication/authorization
5. Monitor service health in Eureka
