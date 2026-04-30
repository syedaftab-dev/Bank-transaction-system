import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 md:p-8 font-body-md text-on-surface">
      <main className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl">account_balance</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl leading-tight font-extrabold text-blue-900 tracking-tight mb-2">EliteBank</h1>
            <p className="font-body-md text-slate-500">Sign in to your account</p>
          </div>
          
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
                <span className="material-symbols-outlined mr-2">error</span>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="font-label-bold text-[12px] font-semibold tracking-[0.05em] text-slate-500 block uppercase">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl font-body-md text-slate-700 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all outline-none"
                  placeholder="name@elitebank.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="font-label-bold text-[12px] font-semibold tracking-[0.05em] text-slate-500 block uppercase">Password</label>
                <Link to="#" className="font-label-sm text-[12px] font-medium text-primary hover:underline decoration-2">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl font-body-md text-slate-700 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center pt-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block font-body-sm text-sm text-slate-600 cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex justify-center items-center py-4 px-6 rounded-xl font-label-bold text-[14px] text-white bg-primary hover:bg-primary-container shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider"
            >
              {loading ? (
                <>
                   <span className="material-symbols-outlined animate-spin text-[18px] mr-2">autorenew</span>
                   Processing...
                </>
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100 w-full">
            <p className="font-body-sm text-sm text-slate-500">
              Not a member yet?{' '}
              <Link to="/signup" className="font-label-bold text-[13px] font-semibold text-primary hover:underline decoration-2 ml-1">
                Apply for Membership
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-6 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <span className="font-label-sm text-[11px] uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">shield</span>
            <span className="font-label-sm text-[11px] uppercase tracking-widest">PCI DSS Compliant</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
