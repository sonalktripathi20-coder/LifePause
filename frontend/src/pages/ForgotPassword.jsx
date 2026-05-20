import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const res = await forgotPassword(email);
    if (res.success) {
      setMessage(res.message);
      // Wait and redirect to reset page
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 3000);
    } else {
      setError(res.message || 'Error executing request.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-brand-dark min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neon/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-accent p-2.5 rounded-2xl text-white mb-3">
            <ShieldAlert size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
          <p className="text-xs text-slate-400 mt-1">We will simulate sending a password reset credential code.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-alert/15 border border-brand-alert/30 text-brand-alert text-xs rounded-2xl">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs rounded-2xl">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Account Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amit.sharma@gmail.com"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Code'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
