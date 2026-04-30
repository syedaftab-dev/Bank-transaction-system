import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import SendMoney from './components/Transactions/SendMoney';
import TransactionHistory from './components/Transactions/TransactionHistory';
import PrivateRoute from './components/Auth/PrivateRoute';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="send-money" element={<SendMoney />} />
                <Route path="transactions" element={<TransactionHistory />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
