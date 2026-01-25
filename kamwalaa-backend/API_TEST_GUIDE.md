# Kamwalaa API Testing Guide

Base URL: `http://localhost:5000/api/v1`

## 1. Health Check
```bash
curl http://localhost:5000/api/v1/health
```

## 2. Cities API
```bash
# Get all cities
curl http://localhost:5000/api/v1/cities
```

## 3. Authentication API

### Send OTP
```bash
curl -X POST http://localhost:5000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\"}"
```

### Verify OTP (New User)
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"otp\":\"123456\",\"name\":\"Test User\"}"
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@kamwalaa.com\",\"password\":\"admin123\"}"
```

## 4. Services API

### Get all services
```bash
curl http://localhost:5000/api/v1/services
```

### Get all categories
```bash
curl http://localhost:5000/api/v1/services/categories
```

### Get services by category
```bash
curl http://localhost:5000/api/v1/services/category/appliances-repair
```

## 5. Bookings API

### Create a booking
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\":\"USER_ID_HERE\",
    \"service_id\":\"SERVICE_ID_HERE\",
    \"booking_date\":\"2026-01-30\",
    \"booking_time\":\"10:00:00\",
    \"address_line1\":\"123 Main Street\",
    \"city\":\"Ranchi\",
    \"pincode\":\"834001\",
    \"payment_method\":\"Cash on Delivery\"
  }"
```

### Get user bookings
```bash
curl http://localhost:5000/api/v1/bookings/user/USER_ID_HERE
```

### Get all bookings (Admin)
```bash
curl http://localhost:5000/api/v1/bookings
```

### Update booking status
```bash
curl -X PUT http://localhost:5000/api/v1/bookings/BOOKING_ID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"confirmed\"}"
```

## 6. Users API

### Get user profile
```bash
curl http://localhost:5000/api/v1/users/USER_ID_HERE
```

### Update user profile
```bash
curl -X PUT http://localhost:5000/api/v1/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Updated Name\",\"email\":\"test@example.com\",\"city\":\"Ranchi\"}"
```

### Add user address
```bash
curl -X POST http://localhost:5000/api/v1/users/USER_ID_HERE/addresses \
  -H "Content-Type: application/json" \
  -d "{
    \"address_type\":\"home\",
    \"address_line1\":\"456 Test Road\",
    \"city\":\"Ranchi\",
    \"state\":\"Jharkhand\",
    \"pincode\":\"834002\",
    \"is_default\":true
  }"
```

## 7. Reviews API

### Submit a review
```bash
curl -X POST http://localhost:5000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -d "{
    \"booking_id\":\"BOOKING_ID_HERE\",
    \"user_id\":\"USER_ID_HERE\",
    \"partner_id\":\"PARTNER_ID_HERE\",
    \"service_id\":\"SERVICE_ID_HERE\",
    \"rating\":5,
    \"comment\":\"Excellent service!\"
  }"
```

### Get service reviews
```bash
curl http://localhost:5000/api/v1/reviews/service/SERVICE_ID_HERE
```

---

## Notes:
- Replace `USER_ID_HERE`, `SERVICE_ID_HERE`, `BOOKING_ID_HERE`, etc. with actual UUIDs from the database
- Get IDs by first calling the GET endpoints (e.g., `/api/v1/cities` will give you city UUIDs)
- OTP is displayed in console during development (check terminal)
- Admin credentials: `admin@kamwalaa.com` / `admin123`
