import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

export const Signup = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Password Strength State
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-brand-alert' });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: 'Very Weak', color: 'bg-brand-alert' });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Very Weak';
    let color = 'bg-brand-alert';

    if (score === 2) {
      label = 'Weak';
      color = 'bg-brand-warning';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-indigo-400';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-brand-success';
    }

    setStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (strength.score < 2) {
      setError('Password is too weak. Please use a stronger password.');
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/onboarding');
    } else {
      setError(res.message || 'Signup failed.');
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen relative flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neon/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-accent p-2.5 rounded-2xl text-white mb-3 shadow-glow-indigo">
            <ShieldAlert size={22} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Legacy Account</h2>
          <p className="text-xs text-slate-400 mt-1">Begin securing your assets and emergency release workflow.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-alert/15 border border-brand-alert/30 text-brand-alert text-xs rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amit Sharma"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-colors text-sm"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
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

            {/* Password strength meter */}
            {password && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-500 uppercase">Strength: <strong className="text-slate-300">{strength.label}</strong></span>
                  <span className="text-[9px] text-slate-500">{strength.score}/4 criteria</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-500 mt-1">
                  Use 8+ characters, capital letter, digit, and special symbol.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-accent font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
