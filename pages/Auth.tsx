
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, CheckCircle, Loader2, Key, ShieldCheck, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export const Auth = () => {
  const { login, register, resetPassword, settings, users } = useStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setFormData({
      ...formData,
      password: '',
      confirmPassword: '',
      referralCode: ''
    });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const userExists = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (userExists) {
      setMode('reset');
    } else {
      setError("No account found with this email address.");
    }
    setIsSubmitting(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 4) {
      return setError("Password must be at least 4 characters.");
    }

    setIsSubmitting(true);
    const res = await resetPassword(formData.email, formData.password);
    if (res.success) {
      setSuccessMsg("Password reset successfully! Please sign in with your new credentials.");
      setMode('login');
    } else {
      setError(res.message);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await register(formData.name, formData.email, formData.password, formData.referralCode);
        if (res.success) {
          setSuccessMsg(res.message);
          setMode('login');
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          setError(res.message);
        }
      } else if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (!success) setError("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-indigo-200 rotate-3 transition-transform hover:rotate-0">
            {mode === 'forgot' || mode === 'reset' ? <ShieldCheck size={40} /> : <ShoppingBag size={40} />}
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{settings.appName}</h1>
          <p className="text-gray-500 mt-2 font-medium">
            {mode === 'login' && 'Welcome back, please sign in'}
            {mode === 'register' && 'Create your earner account'}
            {mode === 'forgot' && 'Account Recovery'}
            {mode === 'reset' && 'Set New Password'}
          </p>
        </div>

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-green-100 animate-in fade-in zoom-in duration-300">
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-bold">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {mode === 'login' || mode === 'register' ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                <input 
                  required 
                  className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                placeholder="name@example.com"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => handleModeChange('forgot')}
                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                required 
                type="password" 
                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Referral Code (Optional)</label>
                <input 
                  className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                  placeholder="XXX123"
                  value={formData.referralCode} 
                  onChange={e => setFormData({...formData, referralCode: e.target.value})}
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (mode === 'register' ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        ) : mode === 'forgot' ? (
          <form onSubmit={handleForgotSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                placeholder="Enter your registered email"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Verify Email'}
            </button>
            <button 
              type="button" 
              onClick={() => handleModeChange('login')}
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">New Password</label>
              <input 
                required 
                type="password" 
                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Confirm New Password</label>
              <input 
                required 
                type="password" 
                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-50" 
                placeholder="••••••••"
                value={formData.confirmPassword} 
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-500 font-medium">
              Don't have an account? {' '}
              <button 
                onClick={() => handleModeChange('register')} 
                disabled={!settings.isRegistrationOpen} 
                className="text-indigo-600 font-black uppercase tracking-wider text-xs hover:underline disabled:text-gray-300"
              >
                Sign Up
              </button>
              {!settings.isRegistrationOpen && <span className="block text-[9px] text-red-400 mt-1 uppercase font-black tracking-tighter">(Registration Closed)</span>}
            </p>
          ) : mode === 'register' ? (
            <p className="text-gray-500 font-medium">
              Already a member? {' '}
              <button 
                onClick={() => handleModeChange('login')} 
                className="text-indigo-600 font-black uppercase tracking-wider text-xs hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
