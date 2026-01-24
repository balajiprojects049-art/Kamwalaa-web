# Kamwalaa Backend API

## 🚀 Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    - A `.env` file has been created with default values.
    - Update the `DB_PASSWORD` and other credentials in `.env` to match your local PostgreSQL setup.

3.  **Database Setup:**
    - Ensure PostgreSQL is running on your machine.
    - Run the setup script to create the database and seed it with initial data:
    ```bash
    npm run db:setup
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```

## 📁 Project Structure

- `server.js`: entry point
- `src/app.js`: express app configuration
- `src/config`: configuration files (db, etc.)
- `src/controllers`: request handlers
- `src/routes`: API route definitions
- `src/middleware`: custom middleware (auth, error handling)
- `src/models`: database models
- `db/schema.sql`: database schema and sample data

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health`: Server health check

### Cities
- `GET /api/v1/cities`: Get all active cities

### Authentication
- `POST /api/v1/auth/send-otp`: Send OTP to phone number
- `POST /api/v1/auth/verify-otp`: Verify OTP and login/register user
- `POST /api/v1/auth/admin/login`: Admin login (email + password)

### Services
- `GET /api/v1/services`: Get all active services
- `GET /api/v1/services/categories`: Get all service categories with subcategories
- `GET /api/v1/services/category/:slug`: Get services by category slug

### Bookings
- `POST /api/v1/bookings`: Create a new booking
- `GET /api/v1/bookings`: Get all bookings (Admin)
- `GET /api/v1/bookings/user/:userId`: Get bookings for a specific user
- `PUT /api/v1/bookings/:id/status`: Update booking status (Admin)

### Users
- `GET /api/v1/users/:id`: Get user profile
- `PUT /api/v1/users/:id`: Update user profile
- `GET /api/v1/users/:id/addresses`: Get user saved addresses
- `POST /api/v1/users/:id/addresses`: Add new address

### Reviews
- `POST /api/v1/reviews`: Submit a review for completed booking
- `GET /api/v1/reviews/service/:serviceId`: Get reviews for a service
- `GET /api/v1/reviews/partner/:partnerId`: Get reviews for a partner

