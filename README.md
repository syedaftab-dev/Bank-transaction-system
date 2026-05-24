<div align="center">
  <h1>🏦 EliteBank - Secure Transaction System</h1>
  <p><strong>A modern, full-stack MERN application designed for high-performance, secure banking transactions.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## ✨ Features

- **🔐 Secure Transactions:** All money transfers require a mandatory, hashed 4-digit PIN verification.
- **📜 Atomic Ledger:** A dual-entry ledger system ensures transaction integrity even in standalone MongoDB environments.
- **⚡ Real-time Updates:** Instant balance updates and transaction history tracking.
- **🎨 Premium UI/UX:** A modern, responsive dashboard built with React, Tailwind CSS, and Lucide React icons.
- **🛡️ Robust Security:** JWT-based authentication stored securely, with password hashing (Bcrypt) and payload validation (Joi).
- **🛠️ Developer Ready:** Fully Docker-ready, automated monorepo build scripts, and production-optimized routing.

---

## 🛠 Tech Stack

### 💻 Frontend (Client)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

- **React 18** — Fast, modern UI development.
- **Tailwind CSS** — Utility-first styling for a premium aesthetic.
- **React Router v6** — Declarative routing and navigation.
- **Axios** & **Context API** — API communication and global state management for auth & transactions.

### ⚙️ Backend (API Server)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

- **Node.js** & **Express.js (v5)** — Robust backend framework.
- **MongoDB** & **Mongoose** — Database for flexible user, account, and ledger storage.
- **Redis (Upstash)** — Fast token blacklisting and session management.
- **JWT & Bcrypt** — Secure user authentication and password/PIN protection.

---

## 🏗 Architecture

EliteBank leverages a scalable MERN architecture with a focus on transaction integrity and security:

```text
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 18)                        │
│   Context API manages Auth & Transaction states globally         │
└──────────┬────────────────────────────┬─────────────────────────┘
           │ HTTP (RESTful API)         │ 
           ▼                            ▼
┌───────────────────────┐    ┌────────────────────────────────────┐
│   EXPRESS API SERVER  │    │           REDIS (Upstash)          │
│   (Node.js / Express) │───>│  (Fast Token Blacklisting &        │
│                       │    │   Session Management)              │
│  • JWT Verification   │    └────────────────────────────────────┘
│  • Input Validation   │
│  • Ledger Processing  │
└──────────┬────────────┘
           │ 
           ▼
┌───────────────────────┐
│   MONGODB CLUSTER     │
│  (Users, Accounts,    │
│   Ledger Entries)     │
└───────────────────────┘
```

### Key Design Decisions

1. **Dual-Entry Ledger:** Instead of simply updating a balance field, every transaction creates two immutable ledger entries (Debit and Credit). The current balance is calculated dynamically on-the-fly via MongoDB aggregation, guaranteeing absolute data integrity.
2. **Lazy Account Initialization:** Bank accounts are automatically generated upon registration or upon the first login, ensuring users never encounter an "Account Not Found" error.
3. **Monorepo Structure:** A single root `package.json` seamlessly manages dependencies and build scripts for both the frontend and backend, enabling easy 1-click deployments on platforms like Render.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18+)
- **MongoDB URI** (Local or MongoDB Atlas)
- **Redis URL** (Local or Upstash)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/bank-system.git
cd bank-system

# Install dependencies for BOTH frontend and backend automatically
npm run install-all
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_url
```

### 3. Running the Application

Because this is a monorepo, you can start both servers concurrently with a single command from the **root** folder:

```bash
# Starts Express on Port 5000 and React on Port 3000
npm run dev
```

Visit `http://localhost:3000` to access the EliteBank dashboard!

---

## 🚢 Deployment (Render)

This project is fully optimized for **Render** using a single-service architecture (the backend serves the frontend in production).

1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:** Add `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, and `NODE_ENV=production` in the Render dashboard.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
