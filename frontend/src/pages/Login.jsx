import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials. Check if backend is active or use mock login (demo@lifepause.in / password).');
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen relative flex items-center justify-center p-4">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neon/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 z-10">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-accent p-2.5 rounded-2xl text-white mb-3 shadow-glow-indigo">
            <ShieldAlert size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Your Vault</h2>
          <p className="text-xs text-slate-400 mt-1">LifePause legacy system authentication portal.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-alert/15 border border-brand-alert/30 text-brand-alert text-xs rounded-2xl leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-brand-neon hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-colors text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Unlock Vault <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-slate-400">
            First time setting up legacy protection?{' '}
            <Link to="/signup" className="text-brand-accent font-semibold hover:underline">Create an Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
