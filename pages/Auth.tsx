import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';

export const Auth = () => {
  const { login, register, settings } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const res = await register(formData.name, formData.email, formData.password, formData.referralCode);
        if (res.success) {
          setSuccessMsg(res.message);
          setIsRegistering(false);
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          setError(res.message);
        }
      } else {
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{settings.appName}</h1>
          <p className="text-gray-500 mt-2">{isRegistering ? 'Create a new account' : 'Welcome back, please login'}</p>
        </div>

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-3 border border-green-200">
            <CheckCircle size={20} />
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">{successMsg} Please login.</p>
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                required 
                className="mt-1 block w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              required 
              type="email" 
              className="mt-1 block w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              required 
              type="password" 
              className="mt-1 block w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
              <input 
                className="mt-1 block w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="XXX123"
                value={formData.referralCode} 
                onChange={e => setFormData({...formData, referralCode: e.target.value})}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={20} />}
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isRegistering ? (
            <p>Already have an account? <button onClick={() => { setIsRegistering(false); setError(''); setSuccessMsg(''); }} className="text-indigo-600 font-semibold">Sign In</button></p>
          ) : (
            <>
              <p>New here? <button onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }} disabled={!settings.isRegistrationOpen} className="text-indigo-600 font-semibold disabled:text-gray-400">Create Account</button></p>
              {!settings.isRegistrationOpen && <span className="text-xs text-red-400">(Registration Closed)</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};