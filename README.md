# 🏦 EliteBank - Secure Transaction System

EliteBank is a modern, full-stack MERN (MongoDB, Express, React, Node.js) application designed for high-performance banking transactions. It features a robust ledger system, secure 4-digit PIN authorization, and a premium interactive dashboard.

---

## 🚀 Live Demo
**[Launch EliteBank Dashboard](https://bank-system-service.onrender.com/)**

---

## ✨ Key Features

- **🔐 Secure Transactions:** All money transfers require a mandatory 4-digit PIN verification.
- **📜 Atomic Ledger:** A dual-entry ledger system ensures transaction integrity even in standalone MongoDB environments.
- **⚡ Real-time Updates:** Instant balance updates and transaction history tracking.
- **🎨 Premium UI/UX:** A modern, responsive dashboard built with React and Tailwind CSS.
- **🛠️ Developer Ready:** Fully Docker-ready, automated build scripts, and production-optimized routing.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, Axios, Context API, Lucide React.
- **Backend:** Node.js, Express 5, Mongoose.
- **Database:** MongoDB (Cloud Atlas) & Redis (Upstash) for session management.
- **Security:** Bcrypt (Hashing), JWT (Authentication), Joi (Validation).

---

## 📂 Project Structure

```text
├── backend/            # Express Server & API Logic
│   ├── src/
│   │   ├── config/     # Database & Redis configurations
│   │   ├── controllers/# Request handlers
│   │   ├── models/     # Mongoose Schemas (Account, Transaction, Ledger)
│   │   ├── services/   # Business logic & Transaction services
│   │   └── middleware/ # Auth, Validation, & Error handling
│   └── server.js       # Entry point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # UI Components (Dashboard, Auth, Transactions)
│   │   ├── contexts/   # Global State (Auth & Transactions)
│   │   └── services/   # API communication
└── package.json        # Root monorepo scripts
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/bank-system.git
cd bank-system
```

### 3. Install Dependencies
```bash
# Install for both frontend and backend
npm run install-all
```

### 4. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 5. Run Locally
```bash
# Start both frontend and backend concurrently
npm run dev
```

---

## 🚢 Deployment (Render)

This project is optimized for **Render** using a single-service architecture.

1.  **Build Command:** `npm run build`
2.  **Start Command:** `npm start`
3.  **Environment Variables:** Add `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, and `NODE_ENV=production` in the Render dashboard.

---

## 🔒 Security Implementation
- **PIN Authorization:** Transactions are protected by a hashed 4-digit PIN stored in the `Account` model.
- **Atomic Updates:** The `transaction.service.js` uses a manual atomic ledger update pattern to ensure data consistency without requiring MongoDB Replica Sets.
- **JWT Auth:** Secure user sessions with token-based authentication.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.
