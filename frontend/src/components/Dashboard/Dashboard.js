import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransaction } from '../../contexts/TransactionContext';

const Dashboard = () => {
  const { 
    balance, 
    transactions, 
    account, 
    loading, 
    error,
    fetchBalance, 
    fetchTransactions, 
    fetchAccount 
  } = useTransaction();

  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    transactionCount: 0
  });

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    fetchAccount();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const sent = transactions
        .filter(t => (t.fromAccount?._id || t.fromAccount) === account?._id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const received = transactions
        .filter(t => (t.toAccount?._id || t.toAccount) === account?._id)
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalSent: sent,
        totalReceived: received,
        transactionCount: transactions.length
      });
    }
  }, [transactions, account]);

  const recentTransactions = transactions.slice(0, 5);

  if (loading && !balance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1440px] mx-auto space-y-8">
      {error && (
        <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Main Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-primary text-white p-6 md:p-10 shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="80" cy="20" fill="white" r="40"></circle>
            <circle cx="100" cy="80" fill="white" r="30"></circle>
          </svg>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-on-primary-container font-label-bold uppercase tracking-widest mb-4 block text-[12px]">Institutional Balance</span>
            <h3 className="font-display-lg text-white mb-2 text-2xl md:text-3xl">Current Balance</h3>
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              ₹{balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/send-money" className="bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors scale-95 active:opacity-80">
                Send Money
              </Link>
              <Link to="/transactions" className="border border-white/30 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors scale-95 active:opacity-80">
                View History
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex justify-end">
            <div className="w-80 h-48 glass-card rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-white/80 text-3xl">contactless</span>
                <span className="text-white/60 font-label-bold tracking-widest text-[12px]">ELITE PLATINUM</span>
              </div>
              <div className="space-y-1">
                <div className="text-white/40 text-[10px] tracking-widest">ACCOUNT ID</div>
                <div className="text-white text-sm font-semibold tracking-wider uppercase">
                  {account?._id?.substring(0, 12) || 'LOADING...'}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-white font-mono text-lg tracking-widest">•••• {account?._id?.slice(-4) || '0000'}</div>
                <div className="w-12 h-8 bg-on-tertiary-container/30 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 text-error rounded-xl">
              <span className="material-symbols-outlined">trending_down</span>
            </div>
            <span className="font-label-bold text-slate-500 uppercase tracking-wider text-[12px]">Total Sent</span>
          </div>
          <div className="text-3xl font-extrabold text-error">
            ₹{stats.totalSent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <span className="font-label-bold text-slate-500 uppercase tracking-wider text-[12px]">Total Received</span>
          </div>
          <div className="text-3xl font-extrabold text-green-600">
            ₹{stats.totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <span className="font-label-bold text-slate-500 uppercase tracking-wider text-[12px]">Transactions</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{stats.transactionCount}</div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 md:px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-headline-sm text-blue-900 text-xl font-bold tracking-tight">Recent Activity</h4>
          <Link to="/transactions" className="text-primary font-label-bold hover:underline text-[12px] font-semibold">View All</Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => {
              const isSent = (transaction.fromAccount?._id || transaction.fromAccount) === account?._id;
              const otherParty = isSent ? transaction.toAccount?.user?.name : transaction.fromAccount?.user?.name;
              
              return (
                <div key={transaction._id} className="px-6 md:px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${isSent ? 'bg-red-50 text-error' : 'bg-green-50 text-green-600'}`}>
                      <span className="material-symbols-outlined">{isSent ? 'arrow_upward' : 'arrow_downward'}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-manrope font-semibold text-on-surface truncate">
                        {isSent ? 'Sent to' : 'Received from'} {otherParty || 'Unknown'}
                      </div>
                      <div className="text-label-sm text-slate-400 text-[12px]">
                        Transfer • {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className={`font-bold ${isSent ? 'text-error' : 'text-green-600'}`}>
                      {isSent ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{transaction.status}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-8 py-10 text-center text-slate-500 font-body-sm">
              No recent activity. Start by sending money or receiving funds!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
