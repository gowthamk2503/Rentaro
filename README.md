# 🚗 Rentaro — Premium Luxury Car Rental & Fleet Management System

<div align="center">

### A modern, full-stack car rental and fleet management platform

Built with the **MERN Stack** · Secure Authentication · Razorpay Payments · Admin Analytics · Fleet Management

</div>

---

## 📌 Overview

**Rentaro** is a full-stack, production-oriented **Car Rental & Fleet Management System** built using the MERN stack.

The platform provides a complete digital rental experience for customers while giving administrators centralized control over vehicles, bookings, users, payments, availability, and business analytics.

### Core Architecture

```text
                    ┌──────────────────────┐
                    │      RENTARO         │
                    │  Car Rental System   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
      ┌───────────────┐                 ┌───────────────┐
      │   CUSTOMER    │                 │     ADMIN     │
      │   PLATFORM    │                 │    PORTAL     │
      └───────┬───────┘                 └───────┬───────┘
              │                                 │
              └────────────────┬────────────────┘
                               ▼
                     ┌──────────────────┐
                     │   REST API       │
                     │ Node + Express   │
                     └────────┬─────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
       MongoDB Atlas       Razorpay       Google OAuth
