import React, { useState, useEffect, useRef } from 'react';
import { useTransaction } from '../../contexts/TransactionContext';

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    note: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1); // 1: search, 2: amount, 3: confirm, 4: pin
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const { 
    balance, 
    account, 
    users, 
    loading, 
    error,
    fetchBalance,
    fetchAccount,
    searchUsers, 
    sendMoney,
    clearError 
  } = useTransaction();

  useEffect(() => {
    fetchBalance();
    fetchAccount();
    clearError();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery.trim());
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const generateIdempotencyKey = () => {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setShowResults(false);
    setStep(2);
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > 0 && parseFloat(formData.amount) <= balance) {
      setStep(3);
      setIdempotencyKey(generateIdempotencyKey());
    }
  };

  const handlePinChange = (index, value) => {
    if (isNaN(value)) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    if (value && index < 3) {
      pinRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current.focus();
    }
  };

  const handleConfirmTransfer = async () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) return;
    if (!selectedUser || !formData.amount) return;

    const result = await sendMoney(
      selectedUser.account._id,
      parseFloat(formData.amount),
      idempotencyKey,
      pinString
    );

    if (result.success) {
      setStep(1);
      setFormData({ recipient: '', amount: '', note: '' });
      setSelectedUser(null);
      setSearchQuery('');
      setPin(['', '', '', '']);
    } else {
      // If PIN is invalid, reset PIN and stay on Step 4
      setPin(['', '', '', '']);
      pinRefs[0].current.focus();
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ recipient: '', amount: '', note: '' });
    setSelectedUser(null);
    setSearchQuery('');
    setShowResults(false);
    setPin(['', '', '', '']);
    clearError();
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-display-lg text-3xl font-extrabold text-blue-900 tracking-tight">Wire Funds</h1>
        <p className="font-body-md text-slate-500 mt-2">Securely transfer capital to domestic and international accounts.</p>
      </div>

      {error && (
        <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">error</span>
          {error}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center flex-1 last:flex-none justify-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-[14px] shadow-sm transition-all duration-300
              ${step === stepNumber ? 'bg-primary text-white scale-110 shadow-primary/30' : 
                step > stepNumber ? 'bg-primary-container text-white' : 'bg-white text-slate-400 border-2 border-slate-100'}
            `}>
              {step > stepNumber ? <span className="material-symbols-outlined text-[18px]">check</span> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > stepNumber ? 'bg-primary' : 'bg-transparent'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100">
        {/* Step 1: Search User */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="font-label-bold text-[12px] uppercase tracking-widest text-slate-500 block mb-3">Select Beneficiary</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person_search</span>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-transparent rounded-xl pl-12 pr-4 py-4 font-body-md text-slate-700 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="Enter name, email, or account ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
              </div>
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="border border-slate-100 rounded-xl max-h-64 overflow-y-auto shadow-lg bg-white absolute z-10 w-full md:w-[calc(100%-4rem)] max-w-2xl mt-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-b-0 transition-colors flex items-center gap-4"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary border border-blue-100">
                        <span className="material-symbols-outlined text-[20px]">account_circle</span>
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="p-6 text-center text-slate-500 flex flex-col items-center">
                     <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                     <p>No beneficiaries found matching your criteria</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && selectedUser && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-2xl">person</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Transfer To</p>
                <p className="text-lg font-black text-blue-900">{selectedUser.name}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleAmountSubmit} className="space-y-6">
              <div>
                <label className="font-label-bold text-[12px] uppercase tracking-widest text-slate-500 block mb-3">Transfer Amount</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl group-focus-within:text-primary transition-colors">currency_rupee</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balance}
                    className="w-full bg-slate-50 border border-transparent rounded-xl pl-12 pr-4 py-4 font-display-lg text-2xl text-blue-900 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                   <p className="text-sm text-slate-500">
                    Available: <span className="font-bold text-blue-900">₹{balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </p>
                  <button type="button" onClick={() => setFormData({...formData, amount: balance})} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">Use Max</button>
                </div>
               
                {formData.amount && parseFloat(formData.amount) > balance && (
                  <p className="mt-2 text-sm text-error flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">warning</span> Insufficient funds for this transfer</p>
                )}
              </div>

              <div>
                <label className="font-label-bold text-[12px] uppercase tracking-widest text-slate-500 block mb-3">Reference / Memo (Optional)</label>
                <div className="relative group">
                   <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors">edit_note</span>
                  <textarea
                    className="w-full bg-slate-50 border border-transparent rounded-xl pl-12 pr-4 py-4 font-body-md text-slate-700 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                    rows={3}
                    placeholder="E.g., Invoice Payment #1234"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.amount || parseFloat(formData.amount) > balance || parseFloat(formData.amount) <= 0}
                  className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-white bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-wider flex justify-center items-center gap-2"
                >
                  <span>Review Transfer</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirm Transfer Details */}
        {step === 3 && selectedUser && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-4xl text-primary">analytics</span>
              </div>
              <h3 className="font-display-lg text-2xl font-bold text-blue-900 mb-2">Review Summary</h3>
              <p className="text-slate-500 text-sm">Please verify the details before moving to authorization.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Beneficiary</span>
                <span className="text-sm font-bold text-blue-900">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Amount</span>
                <span className="text-lg font-black text-blue-900">
                  ₹{parseFloat(formData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {formData.note && (
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memo</span>
                  <span className="text-sm text-slate-700 italic max-w-[60%] text-right">{formData.note}</span>
                </div>
              )}
              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Estimated Total</span>
                  <span className="text-2xl font-black text-primary">
                    ₹{parseFloat(formData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wider"
              >
                Modify
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-white bg-primary shadow-xl shadow-primary/30 transition-all uppercase tracking-wider flex justify-center items-center gap-2"
              >
                <span>Authorize with PIN</span>
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: PIN Entry */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-4xl text-primary">password</span>
              </div>
              <h3 className="font-display-lg text-2xl font-bold text-blue-900 mb-2">Secure Authorization</h3>
              <p className="text-slate-500 text-sm">Enter your 4-digit transaction PIN to confirm.</p>
            </div>

            <div className="flex justify-center gap-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={pinRefs[index]}
                  type="password"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-20 text-center text-3xl font-bold bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setStep(3)}
                disabled={loading}
                className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wider"
              >
                Back
              </button>
              <button
                onClick={handleConfirmTransfer}
                disabled={loading || pin.join('').length !== 4}
                className="flex-1 py-4 px-6 rounded-xl font-label-bold text-[14px] text-white bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/30 transition-all uppercase tracking-wider flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMoney;
