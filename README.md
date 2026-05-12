# SweetShop

SweetShop is a full-stack online sweet shopping application built with Spring Boot and React. It includes product browsing, cart management, checkout, payment-method selection, order placement, admin routes, JWT authentication, and a responsive storefront UI.

## Live Demo

- Frontend: https://sweetshop-frontend-u6i5.onrender.com
- Backend API: https://sweetshop-yhsy.onrender.com/api

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Security, Spring Data JPA, JWT
- Frontend: React, Vite, Bootstrap, React Router, Axios
- Database: PostgreSQL on Render for deployment, H2 for local development
- Deployment: Render Web Service and Render Static Site

## Features

- User registration and login
- JWT-based protected routes
- Product listing with search, category filter, sorting, and stock display
- Product detail page with related sweets
- Cart with quantity controls, stock checks, subtotal, delivery, discount, tax, and total
- Checkout form with address, notes, UPI/card/COD payment options
- Order placement and order history
- Admin dashboard, sweet management, and order management
- Responsive shopping-app UI

## Project Structure

```text
sweetshop/
├── src/                     # Spring Boot backend
├── sweetshop-frontend/       # React/Vite frontend
├── pom.xml                  # Backend dependencies/build
├── Dockerfile               # Backend deployment container
└── README.md
```

## Local Setup

### Backend

Run from the project root:

```powershell
cd C:\Users\ranve\Downloads\sweetshop\sweetshop
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

The local backend uses H2 by default, so no local PostgreSQL/MySQL setup is required.

### Frontend

Open another terminal:

```powershell
cd C:\Users\ranve\Downloads\sweetshop\sweetshop\sweetshop-frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Default Local Admin

The backend creates a default admin user on startup:

```text
Username: admin
Password: admin123
```

## Environment Variables

For deployment, configure these backend variables:

```text
DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DRIVER=org.postgresql.Driver
DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

For frontend deployment:

```text
VITE_API_URL=https://your-backend-url.onrender.com/api
```

For this deployment:

```text
VITE_API_URL=https://sweetshop-yhsy.onrender.com/api
```

## Render Deployment

### Backend Web Service

Use the repo root and Docker deployment:

```text
Name: sweetshop-backend
Root Directory: leave empty
Runtime: Docker
Branch: main
```

Set the backend environment variables listed above.

### Frontend Static Site

```text
Name: sweetshop-frontend
Root Directory: sweetshop-frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Add:

```text
VITE_API_URL=https://sweetshop-yhsy.onrender.com/api
```

For React Router, add this rewrite in Render Static Site settings:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

## Useful Commands

Backend compile:

```powershell
.\mvnw.cmd -DskipTests compile
```

Frontend lint:

```powershell
cd sweetshop-frontend
npm run lint
```

Frontend production build:

```powershell
cd sweetshop-frontend
npm run build
```
