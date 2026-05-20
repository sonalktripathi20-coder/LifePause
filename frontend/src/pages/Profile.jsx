import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { User, Mail, ShieldCheck, Key, Settings, Award } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useAppState();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    showToast('Profile credentials saved successfully (Simulated).');
  };

  return (
    <DashboardLayout pageTitle="User Profile Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form column */}
        <div className="lg:col-span-2 space-y-6">
          <PremiumCard hoverGlow="none">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider text-left">Personal Account Details</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      required
                      disabled
                      value={email}
                      className="w-full bg-slate-900/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                >
                  Save Profile Credentials
                </button>
              </div>
            </form>
          </PremiumCard>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <PremiumCard hoverGlow="indigo">
            <div className="flex items-center gap-3.5 mb-6 text-left">
              <div className="bg-gradient-to-tr from-brand-accent to-brand-neon text-white p-3 rounded-2xl shadow-glow-indigo shrink-0">
                <Award size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Active Plan Tier</span>
                <strong className="text-base font-bold text-white block mt-0.5">{user?.subscriptionPlan} Protection</strong>
              </div>
            </div>

            <div className="space-y-3.5 text-left text-xs">
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Registration Date</span>
                <span className="text-xs font-semibold text-white block">May 20, 2026</span>
              </div>

              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Vault Privacy Lock</span>
                  <span className="text-xs font-semibold text-white block">Enabled</span>
                </div>
                <ShieldCheck className="text-brand-success" size={18} />
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
