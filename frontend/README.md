# Bank System Frontend

A modern, responsive web application for the Bank System that allows users to manage their accounts, send money, and view transaction history.

## Features

### 🔐 Authentication
- User registration and login
- Secure JWT-based authentication
- Automatic token management
- Protected routes

### 💰 Banking Features
- **Dashboard**: Overview of account balance and recent transactions
- **Send Money**: Search users and transfer funds with confirmation
- **Transaction History**: View all transactions with filters and search
- **Real-time Balance**: Up-to-date account balance

### 🎨 User Experience
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3001`

### Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── PrivateRoute.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── Layout/
│   │   │   └── Layout.js
│   │   └── Transactions/
│   │       ├── SendMoney.js
│   │       └── TransactionHistory.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── TransactionContext.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## API Integration

The frontend connects to the backend API at `/api` with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Accounts
- `GET /api/accounts/my-account` - Get user account details
- `GET /api/accounts/balance` - Get account balance

### Transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions` - Get user transactions

### Users
- `GET /api/users/search` - Search for users

## Usage

### 1. Login or Register
- Visit `/login` to sign in with existing credentials
- Visit `/signup` to create a new account

### 2. Dashboard
- View your current balance
- See recent transactions
- Quick access to send money and view history

### 3. Send Money
- Search for users by name or email
- Enter amount and optional note
- Confirm and complete the transfer

### 4. Transaction History
- View all past transactions
- Filter by status (completed, pending, failed)
- Search by recipient name or transaction ID

## Security Features

- JWT token-based authentication
- Protected routes for authenticated users
- Automatic token refresh
- Secure API communication
- Input validation and sanitization

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Error Handling

- User-friendly error messages
- Network error handling
- Form validation
- Loading states for better UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
