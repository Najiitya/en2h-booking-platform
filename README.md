# EN2H Booking Platform REST API

## Project Overview
A robust, fully tested backend REST API built with NestJS to manage users, bookable services, and appointments. It features complete JWT-based authentication and a lightweight SQLite database managed via TypeORM. 

## Installation Steps
Ensure you have Node.js and npm installed on your machine. Clone the repository and install all required dependencies:

```bash
# Clone the repository
git clone <your-repo-url>
cd en2h-booking-platform

# Install dependencies
npm install

Environment Variables
In a production environment, sensitive data should be managed via a .env file. Currently, the app runs with default configurations, but you should configure the following if moving to production:

PORT=3000
JWT_SECRET=your_super_secret_jwt_key
DATABASE_TYPE=better-sqlite3
DATABASE_NAME=en2h_booking.sqlite

Database Setup
This project uses SQLite (better-sqlite3) as its database. For development purposes, TypeORM is configured with synchronize: true.
This means you do not need to manually create the database or tables. The en2h_booking.sqlite database file and all associated tables (Users, Services, Bookings) will be automatically generated in the root directory the first time you run the application.

Running the Application
To start the server in development mode with hot-reloading enabled:

# Start the server in watch mode
npm run start:dev

The API will be available at http://localhost:3000.

Running Migrations
Note: Because TypeORM is currently set to synchronize: true in app.module.ts, schema changes are handled automatically on server restart.

When migrating to a production environment (where synchronize must be false), you will use the TypeORM CLI for migrations:

# Generate a new migration based on entity changes
npm run typeorm migration:generate -- -n MigrationName

# Run pending migrations
npm run typeorm migration:run

API Documentation
🔐 Authentication
POST /auth/register - Register a new user (Body: email, password)

POST /auth/login - Authenticate and receive a signed JWT access token

👤 Users
POST /users - Create a user directly (Admin fallback)

GET /users - Retrieve a list of all users

GET /users/:id - Retrieve a specific user by UUID

PATCH /users/:id - Update user details

DELETE /users/:id - Remove a user from the system

🏷️ Services
POST /services - Create a new bookable service (Body: name, description, price, duration)

GET /services - List all available services

GET /services/:id - Retrieve a specific service by UUID

PATCH /services/:id - Update service pricing or duration

DELETE /services/:id - Remove a service

📅 Bookings
POST /bookings - Schedule a new appointment (Body: userId, serviceId, appointmentDate, status)

GET /bookings - View all system bookings

GET /bookings/:id - Retrieve specific booking details

PATCH /bookings/:id - Update a booking's status

DELETE /bookings/:id - Cancel or remove a booking

Assumptions Made
Database: SQLite is sufficient for the current development and demonstration phase.

Authentication: Plain text passwords are used strictly for rapid prototyping. (See Future Improvements).

Schema Synchronization: TypeORM's synchronize: true is acceptable for local development to bypass manual migration management.

Authorization: The JWT strategy currently authenticates users, but specific Role-Based Access Control (RBAC) route guards are not yet strictly enforced on CRUD endpoints.

Future Improvements
Password Hashing: Integrate bcrypt into the AuthService to securely hash passwords before saving them to the database.

Role Guards: Implement NestJS Guards to restrict endpoints (e.g., only admin roles can create/delete Services or view all Users).

Automated Documentation: Integrate @nestjs/swagger to auto-generate a Swagger UI for API testing and documentation.

Production Database: Migrate from SQLite to PostgreSQL or MySQL for production scalability.

Input Validation: Add class-validator and class-transformer to the DTOs to ensure incoming request bodies match required formats.