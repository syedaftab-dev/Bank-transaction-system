import React, { useEffect, useState } from 'react';
import { useTransaction } from '../../contexts/TransactionContext';

const TransactionHistory = () => {
  const { 
    transactions, 
    account, 
    loading, 
    error,
    fetchTransactions,
    fetchAccount
  } = useTransaction();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
    fetchAccount();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'FAILED':
      case 'REVERSED':
        return 'bg-red-50 text-error border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'check_circle';
      case 'PENDING':
        return 'schedule';
      case 'FAILED':
      case 'REVERSED':
        return 'cancel';
      default:
        return 'info';
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm === '' || 
      transaction.toAccount?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.fromAccount?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.idempotencyKey?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    const isSent = (transaction.fromAccount?._id || transaction.fromAccount) === account?._id;
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'sent' && isSent) || 
      (typeFilter === 'received' && !isSent);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-3xl font-extrabold text-blue-900 tracking-tight">Ledger</h1>
        <p className="font-body-md text-slate-500 mt-1">Review your institutional transaction history.</p>
      </div>

      {error && (
        <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search by name, ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-lg pl-12 pr-4 py-3 font-body-sm text-on-surface focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-none rounded-lg pl-4 pr-10 py-3 font-label-bold text-slate-600 focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none cursor-pointer uppercase tracking-wider text-[12px]"
            >
              <option value="all">All Types</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>

          <div className="relative w-full md:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-none rounded-lg pl-4 pr-10 py-3 font-label-bold text-slate-600 focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none cursor-pointer uppercase tracking-wider text-[12px]"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REVERSED">Reversed</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-slate-400 text-3xl">receipt_long</span>
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">No records found</h3>
            <p className="text-slate-500 font-body-sm">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Adjust your filters to see more results.'
                : 'Your transaction history will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-label-bold text-[10px] uppercase tracking-[0.1em] text-slate-400">Transaction</th>
                  <th className="px-6 py-4 font-label-bold text-[10px] uppercase tracking-[0.1em] text-slate-400">Date & Time</th>
                  <th className="px-6 py-4 font-label-bold text-[10px] uppercase tracking-[0.1em] text-slate-400">Status</th>
                  <th className="px-6 py-4 font-label-bold text-[10px] uppercase tracking-[0.1em] text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => {
                  const isSent = (transaction.fromAccount?._id || transaction.fromAccount) === account?._id;
                  const otherParty = isSent 
                    ? transaction.toAccount?.user 
                    : transaction.fromAccount?.user;
                  
                  return (
                    <tr key={transaction._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSent ? 'bg-red-50 text-error' : 'bg-green-50 text-green-600'}`}>
                            <span className="material-symbols-outlined text-sm">{isSent ? 'arrow_upward' : 'arrow_downward'}</span>
                          </div>
                          <div>
                            <div className="font-manrope font-bold text-sm text-blue-900">
                              {isSent ? 'Transfer to' : 'Transfer from'} {otherParty?.name || 'Unknown'}
                            </div>
                            {transaction.idempotencyKey && (
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[200px]">
                                REF: {transaction.idempotencyKey}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body-sm text-sm text-slate-600">{formatDate(transaction.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(transaction.status)}`}>
                          <span className="material-symbols-outlined text-[14px]">{getStatusIcon(transaction.status)}</span>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-manrope font-extrabold text-lg ${isSent ? 'text-error' : 'text-green-600'}`}>
                          {isSent ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
