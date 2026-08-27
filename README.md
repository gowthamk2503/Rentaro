# Rentaro — Premium Luxury Car Rental & Fleet Management System

Rentaro is a full-stack, enterprise-grade Car Rental & Fleet Management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring real-time Razorpay payment checkout, Google OAuth 2.0 authentication, admin analytics dashboards, fleet lifecycle management, and a light UI design system.

---

## 🚗 Key Features

### 🌟 Customer Experience
- **Luxury Fleet Catalog**: Dynamic category filtering (Electric, SUV, Luxury, Economy), multi-parameter search, and price sorting.
- **Detailed Specifications Matrix**: Comprehensive technical specs (acceleration, top speed, horsepower, range, transmission), color selection, and interactive features checklist.
- **Live Booking & Checkout**: Real-time date range picker, automatic tax/fee calculations, and Razorpay payment gateway integration.
- **Customer Dashboard**: Track active rentals, booking history, status updates, and download printable vouchers/tax invoices.
- **User Authentication**: Secure JWT session management, Google OAuth 2.0 Identity Services, and persistent profile management.

### 🛡️ Admin Portal
- **Telemetry & KPI Dashboard**: Real-time fleet metrics, revenue trajectory charts, utilization rates, and booking status breakdowns.
- **Fleet Inventory Manager**: Add, edit, delete, and toggle instant vehicle availability with photo selectors and dynamic feature tag builder.
- **Booking Management**: Comprehensive reservation tracking with status transitions (`Confirmed`, `Active`, `Completed`, `Cancelled`) and detailed drawer vouchers.
- **User Directory**: Driver accounts, role elevation, and activation management.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite 6, React Router 7, Axios, Recharts, React Icons, `@react-oauth/google`
- **Styling**: Modern Vanilla CSS Design System (`Space Mono` & `Inter` typography, glassmorphism, responsive grid)
- **Backend**: Node.js, Express.js 5, JSON Web Tokens (JWT), Bcrypt, Razorpay SDK, Google OAuth2
- **Database**: MongoDB & Mongoose ODM

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)

### 2. Backend Setup
```bash
cd Backend
npm install
# Configure your .env file based on .env.example
npm start
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
# Configure your .env file based on .env.example
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔐 Demo Credentials

- **Admin Account**: `admin@rentaro.com` / `Admin@123`
- **Customer Account**: `customer@example.com` / `Password@123`

---

## 📄 License
MIT License © 2026 Rentaro Mobility Solutions Inc.
