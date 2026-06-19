<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&pause=1000&color=F59E0B&center=true&vCenter=true&width=600&lines=🚗+RENTARO;Your+Premium+Car+Rental+Platform;Drive+Your+Dream+Car+Today!" alt="Typing SVG" />

<br/>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel" />
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" />
  <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Educational-blue?style=for-the-badge" />
</p>

<br/>

> **Rentaro** is a full-stack MERN car rental platform — browse vehicles, book instantly, pay seamlessly, and manage everything from one sleek dashboard.

<br/>

<a href="https://rentaro.vercel.app">
  <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Now-F59E0B?style=for-the-badge" />
</a>
&nbsp;
<a href="https://github.com/gowthamk2503/Rentaro">
  <img src="https://img.shields.io/badge/⭐ Star on GitHub-Support the Project-24292e?style=for-the-badge&logo=github" />
</a>

</div>

---

## 📸 Preview

<div align="center">

| Home Page | Car Browsing | Booking Flow | Admin Dashboard |
|:---------:|:------------:|:------------:|:---------------:|
| 🏠 | 🚘 | 📅 | 📊 |
| Browse featured cars | Filter & explore fleet | Book + pay instantly | Full control panel |

</div>

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 👤 User Experience
- 🔐 Secure JWT Authentication
- 🚗 Browse & filter available cars
- 📋 View detailed car specs
- 📅 Instant online booking
- 💳 UPI / QR / COD payments
- 🧾 Upload payment screenshots
- 📜 Full rental history
- 👤 Profile management

</td>
<td width="50%">

### 🛠️ Admin Control
- 📊 Analytics dashboard
- 🚘 Manage car inventory
- 👥 Manage users
- 📦 Manage bookings
- 💰 Payment tracking
- 📈 Revenue charts
- 📉 Booking statistics
- ✅ Car availability tracking

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENTARO STACK                           │
├──────────────┬──────────────────┬──────────────────────────────┤
│   FRONTEND   │     BACKEND      │         DATABASE             │
│──────────────│──────────────────│──────────────────────────────│
│  React.js    │   Node.js        │   MongoDB Atlas              │
│  Vite        │   Express.js     │   Mongoose ODM               │
│  React Router│   JWT Auth       │                              │
│  Axios       │   bcryptjs       │         DEPLOY               │
│  Recharts    │   Multer         │──────────────────────────────│
│  CSS3        │   REST APIs      │  Frontend → Vercel           │
│              │                  │  Backend  → Render           │
└──────────────┴──────────────────┴──────────────────────────────┘
```

---

## 📂 Project Structure

```bash
Rentaro/
│
├── 🗂️ car-booking-backend/        # Express + Node.js Server
│   ├── controllers/               # Route logic
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # API endpoints
│   ├── middleware/                # Auth & validation
│   └── server.js                  # Entry point
│
├── 🎨 renteasy/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Route-level pages
│   │   └── assets/                # Images & static files
│   └── public/
│
└── 📄 README.md
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/gowthamk2503/Rentaro.git
cd Rentaro
```

### 2. Backend Setup

```bash
cd car-booking-backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the server:

```bash
npm start
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd renteasy
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 Authentication & Security

| Feature | Implementation |
|---|---|
| Token Auth | JSON Web Tokens (JWT) |
| Password Storage | bcrypt hashing |
| Route Protection | Middleware guards |
| Validation | Duplicate email prevention |
| Session | Secure token storage |

---

## 💳 Payment System

Rentaro supports multiple payment flows out of the box:

```
User selects car → Picks dates → Chooses payment method
        │
        ├── 📱 UPI Payment
        ├── 📷 QR Code Scan
        └── 💵 Cash on Delivery
                │
                └── Upload screenshot / Enter Transaction ID
                            │
                            └── ✅ Admin verifies → Booking Confirmed
```

---

## 📊 Admin Dashboard

<div align="center">

| Metric | Description |
|:------:|:-----------|
| 🚗 Total Cars | Full vehicle inventory count |
| ✅ Available Cars | Real-time availability |
| 📦 Total Bookings | All-time booking volume |
| 🔄 Active Bookings | Currently ongoing rentals |
| 💰 Total Revenue | Earnings overview |
| 👥 Registered Users | Platform user base |
| 📈 Revenue Charts | Visual revenue trends |
| 📉 Booking Analytics | Booking pattern insights |

</div>

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [https://rentaro.vercel.app](https://rentaro.vercel.app) |
| ⚙️ Backend | [https://rentaro-ynxo.onrender.com](https://rentaro-ynxo.onrender.com) |

---

## 📡 API Reference

<details>
<summary><b>🔐 Auth Endpoints</b></summary>

```http
POST   /api/auth/register       → Register new user
POST   /api/auth/login          → Login & receive JWT
GET    /api/auth/profile        → Get current user
```
</details>

<details>
<summary><b>🚗 Car Endpoints</b></summary>

```http
GET    /api/cars                → List all cars
GET    /api/cars/:id            → Get car details
POST   /api/cars                → Add car (Admin)
PUT    /api/cars/:id            → Update car (Admin)
DELETE /api/cars/:id            → Remove car (Admin)
```
</details>

<details>
<summary><b>📦 Booking Endpoints</b></summary>

```http
POST   /api/bookings            → Create booking
GET    /api/bookings/my         → User booking history
GET    /api/bookings            → All bookings (Admin)
PATCH  /api/bookings/:id        → Update booking status
DELETE /api/bookings/:id        → Cancel booking
```
</details>

<details>
<summary><b>💳 Payment Endpoints</b></summary>

```http
POST   /api/payments            → Submit payment
GET    /api/payments            → All payments (Admin)
PATCH  /api/payments/:id/verify → Verify payment (Admin)
```
</details>

---

## 🔮 Roadmap

- [ ] 🗺️ Google Maps integration for pickup/drop locations
- [ ] 📧 Email confirmation & booking notifications
- [ ] 💬 Real-time chat with support
- [ ] 📱 React Native mobile app
- [ ] 💳 Razorpay / Stripe payment gateway
- [ ] 🤖 AI-based car recommendation engine
- [ ] 📄 Invoice PDF generation

---

## 🎯 What I Learned

Building Rentaro taught me end-to-end MERN development — from designing RESTful APIs and securing routes with JWT, to building responsive UIs with React and visualizing data with Recharts. The payment flow with screenshot uploads added a real-world dimension that sharpened my understanding of file handling and async state management.

---

## 👨‍💻 Author

<div align="center">

### Gowtham K

🎓 B.Tech Information Technology — Sri Eshwar College of Engineering

[![GitHub](https://img.shields.io/badge/GitHub-gowthamk2503-24292e?style=for-the-badge&logo=github)](https://github.com/gowthamk2503)
[![Email](https://img.shields.io/badge/Email-gowtham.k2023it@sece.ac.in-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gowtham.k2023it@sece.ac.in)

</div>

---

<div align="center">

### ⭐ If Rentaro helped or inspired you, drop a star — it means a lot!

*Built with 💛 for learning, portfolio, and the love of clean code.*

</div>
