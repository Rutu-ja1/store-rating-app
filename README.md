# Store Rating App
Full Stack Coding Challenge — Roxiler Systems (Job Code 3124)

## Tech Stack
- Backend  : NestJS + TypeORM + PostgreSQL
- Frontend : React + TypeScript + Tailwind CSS
- Auth     : JWT + Role-based Access Control

## Project Structure
store-rating-app/
  store-rating-backend/   → NestJS REST API
  store-rating-frontend/  → React Application

## Setup Instructions

### Backend
cd store-rating-backend
npm install
# create .env file (see .env.example)
npm run start:dev

### Frontend
cd store-rating-frontend
npm install
npm run dev

### Environment Variables
Create .env file in store-rating-backend/:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=store_rating
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

## Default Admin Login
Email    → admin@storerate.com
Password → Admin@123

## Features
✅ Admin dashboard with stats
✅ Role-based access (Admin, Normal User, Store Owner)
✅ JWT Authentication
✅ Store ratings 1 to 5 stars
✅ Modify submitted ratings
✅ Sortable and filterable tables
✅ Form validations
✅ Change password for all roles
✅ Responsive UI
