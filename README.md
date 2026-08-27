# 🚗 Rentaro

<div align="center">

# Rentaro — Premium Luxury Car Rental & Fleet Management System

### 🚘 Drive Premium. Book Smarter.

A modern, full-stack car rental and fleet management platform built with the MERN stack.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF)](https://razorpay.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Application Workflow](#-application-workflow)
- [Authentication](#-authentication)
- [Booking System](#-booking-system)
- [Payment System](#-payment-system)
- [Admin Dashboard](#-admin-dashboard)
- [Database Design](#-database-design)
- [API Architecture](#-api-architecture)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Database Seeding](#-database-seeding)
- [Production Deployment](#-production-deployment)
- [Security](#-security)
- [Testing Checklist](#-testing-checklist)
- [Future Roadmap](#-future-roadmap)
- [Engineering Concepts](#-engineering-concepts)
- [Contributing](#-contributing)
- [Developer](#-developer)
- [License](#-license)

---

# 🌟 Overview

**Rentaro** is a full-stack **Luxury Car Rental & Fleet Management System** developed using the MERN stack.

The application digitizes the complete vehicle rental lifecycle, from discovering vehicles and checking availability to booking, payment, rental tracking, and administrative fleet management.

Rentaro provides two major interfaces:

### 👤 Customer Platform

Customers can:

- Browse the luxury vehicle fleet
- Search and filter cars
- View detailed vehicle specifications
- Select rental dates
- Check availability
- Calculate rental costs
- Make online payments
- Track bookings
- Manage profiles
- View booking history
- Access vouchers and invoices
- Login using Google OAuth

### 🛡️ Admin Platform

Administrators can:

- Monitor fleet KPIs
- Manage vehicles
- Manage vehicle availability
- Manage bookings
- Update booking status
- Manage users
- Control user roles
- Monitor revenue
- Analyze fleet utilization
- View booking statistics

---

# 🚗 Features

## 👤 Customer Features

### 🔎 Fleet Discovery

Rentaro provides a dynamic vehicle discovery experience.

Features include:

- Vehicle search
- Category filtering
- Price sorting
- Availability filtering
- Electric vehicles
- SUVs
- Luxury vehicles
- Economy vehicles
- Dynamic fleet catalog

---

## 🚘 Vehicle Details

Each vehicle can contain comprehensive specifications such as:

- Vehicle name
- Category
- Price per day
- Horsepower
- Top speed
- Acceleration
- Range
- Transmission
- Colors
- Features
- Images
- Availability

---

## 📅 Smart Booking

Customers can:

1. Select a vehicle
2. Select rental dates
3. Check availability
4. Calculate rental duration
5. Calculate taxes and fees
6. Review booking details
7. Proceed to checkout
8. Complete payment
9. Receive booking confirmation

### Booking Flow

```text
┌──────────────────────┐
│   Browse Vehicles    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Select Vehicle     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Select Dates       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Check Availability   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate Pricing    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Razorpay Checkout  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Payment Verification│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Booking Confirmation │
└──────────────────────┘
