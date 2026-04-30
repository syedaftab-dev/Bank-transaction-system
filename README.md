# Bank Transaction System

> A robust, production-ready backend service for managing bank transactions, user authentication, and email notifications. Built with Node.js, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## ✨ Features

- **User Management**: Secure registration, login, and profile management with JWT authentication.
- **Transaction Ledger**: Double-entry bookkeeping style transaction tracking with balance verification.
- **Email Notifications**: Automated emails for registration, transaction confirmations, and password resets via Nodemailer.
- **RESTful API**: Clean, standardized API endpoints with comprehensive error handling.
- **Security**: Password hashing (bcrypt), input validation, and rate limiting.
- **Scalability**: Modular architecture separating controllers, services, and models.

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js (v16+) |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) |
| **Email** | Nodemailer |
| **Validation** | Joi / express-validator |
| **Environment** | dotenv |
| **Testing** | Jest / Supertest |
| **Linting** | ESLint |

## 📁 Project Structure

```text
Bank-transaction-system/
├── src/
│   ├── config/           # Database and server configuration
│   ├── controllers/      # Route logic (Request/Response handling)
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and external integrations
│   ├── utils/            # Helper functions and formatters
│   └── app.js            # Express app setup (without server start)
├── tests/                # Unit and integration tests
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── server.js             # Application entry point
└── README.md             # This file

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **MongoDB** (Local or Atlas)
- **npm** or **yarn**

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/syedaftab-dev/Bank-transaction-system.git
   cd Bank-transaction-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your credentials**
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/bank_transactions

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d

   # Email (SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```

5. **Run the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## ⚙️ Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Server port | `3000` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` | Yes |
| `JWT_SECRET` | Secret key for signing tokens | - | Yes |
| `JWT_EXPIRE` | Token expiration time | `7d` | No |
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` | Yes |
| `EMAIL_USER` | Sender email address | - | Yes |
| `EMAIL_PASS` | SMTP password/app password | - | Yes |

## 📖 Usage

### Available NPM Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest --coverage",
  "lint": "eslint src/",
  "lint:fix": "eslint src/ --fix"
}
```

### Running in Production
```bash
NODE_ENV=production npm start
```

## 🔌 API Documentation

Base URL: `http://localhost:3000/api`

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "success",
  "message": "Service is running",
  "timestamp": "2026-04-30T12:00:00.000Z"
}
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Transactions
*All transaction endpoints require `Authorization: Bearer <token>`*

#### Create Transaction
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "credit",
  "amount": 500.00,
  "description": "Salary deposit"
}
```

#### Get All Transactions
```http
GET /transactions?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Transaction
```http
GET /transactions/:id
Authorization: Bearer <token>
```

## 🗄 Database Schema

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Transaction Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true, min: 0 },
  balanceAfter: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  reference: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
}
```

## 🧪 Testing

Run the test suite with coverage:
```bash
npm test
```

Run specific test file:
```bash
npm test -- test/auth.test.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 👤 Author

**Syed Aftab**
- GitHub: [@syedaftab-dev](https://github.com/syedaftab-dev)
- Email: syedaftab488@gmail.com

---
*Built with ❤️ using Node.js, Express, and MongoDB*
```
