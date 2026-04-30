import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 md:p-8 font-body-md text-on-surface">
      <main className="w-full max-w-2xl">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl">person_add</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl leading-tight font-extrabold text-blue-900 tracking-tight mb-2">Create Account</h1>
            <p className="font-body-md text-slate-500">Apply for EliteBank Membership</p>
          </div>
          
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
                <span className="material-symbols-outlined mr-2">error</span>
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="font-label-bold text-[12px] font-semibold tracking-[0.05em] text-slate-500 block uppercase">Full Legal Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl font-body-md text-slate-700 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
              
              <div className="space-y-2">
                <label htmlFor="password" className="font-label-bold text-[12px] font-semibold tracking-[0.05em] text-slate-500 block uppercase">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength="6"
                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl font-body-md text-slate-700 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all outline-none"
                    placeholder="Create a secure password"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="font-label-bold text-[12px] font-semibold tracking-[0.05em] text-slate-500 block uppercase">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength="6"
                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl font-body-md text-slate-700 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary/30 transition-all outline-none"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-error">Passwords do not match</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.password !== formData.confirmPassword}
              className="mt-6 w-full flex justify-center items-center py-4 px-6 rounded-xl font-label-bold text-[14px] text-white bg-primary hover:bg-primary-container shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? (
                <>
                   <span className="material-symbols-outlined animate-spin text-[18px] mr-2">autorenew</span>
                   Processing...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100 w-full">
            <p className="font-body-sm text-sm text-slate-500">
              Already a member?{' '}
              <Link to="/login" className="font-label-bold text-[13px] font-semibold text-primary hover:underline decoration-2 ml-1">
                Access your vault
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
