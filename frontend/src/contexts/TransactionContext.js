import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const TransactionContext = createContext();

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions],
        balance: state.balance - action.payload.amount
      };
    default:
      return state;
  }
};

const initialState = {
  balance: 0,
  transactions: [],
  account: null,
  users: [],
  loading: false,
  error: null
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const fetchBalance = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/accounts/balance');
      dispatch({ type: 'SET_BALANCE', payload: response.data.balance });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch balance' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/transactions');
      dispatch({ type: 'SET_TRANSACTIONS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch transactions' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchAccount = async () => {
    try {
      const response = await api.get('/accounts/my-account');
      dispatch({ type: 'SET_ACCOUNT', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch account' });
    }
  };

  const searchUsers = async (query) => {
    try {
      const response = await api.get(`/users/search?q=${query}`);
      dispatch({ type: 'SET_USERS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to search users' });
    }
  };

  const sendMoney = async (toAccount, amount, idempotencyKey, pin) => {
    try {
      if (!state.account?._id) {
        throw new Error('Account details not found. Please refresh the page.');
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await api.post('/transactions', {
        fromAccount: state.account._id,
        toAccount,
        amount,
        idempotencyKey,
        pin
      });
      
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data.transaction });
      await fetchBalance();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Transaction failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <TransactionContext.Provider value={{
      ...state,
      fetchBalance,
      fetchTransactions,
      fetchAccount,
      searchUsers,
      sendMoney,
      clearError
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
