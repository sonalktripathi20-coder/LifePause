import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { Bell, ShieldCheck, Database, Menu, Sparkles, LogOut } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export const Navbar = ({ onMobileToggle, pageTitle }) => {
  const { user, offlineMode, logout } = useAuth();
  const { notifications } = useAppState();
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'Family':
        return (
          <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-400/30 flex items-center gap-1 shadow-glow-indigo">
            <Sparkles size={8} /> Family
          </span>
        );
      case 'Premium':
        return (
          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-400/30 flex items-center gap-1 shadow-glow-cyan">
            <Sparkles size={8} /> Premium
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700/50">
            Free Plan
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/5 py-4 px-6 flex items-center justify-between">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileToggle}
          className="lg:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h2>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Offline/Online Database Status */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/40 border border-white/5 px-2.5 py-1 rounded-xl text-[10px] font-semibold">
          {offlineMode ? (
            <>
              <Database size={12} className="text-brand-warning animate-pulse" />
              <span className="text-brand-warning/90">Demo Fallback Mode</span>
            </>
          ) : (
            <>
              <ShieldCheck size={12} className="text-brand-success" />
              <span className="text-brand-success/90">Database Live</span>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className="relative p-2 rounded-xl bg-slate-900/60 border border-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
          >
            <Bell size={18} />
            {getUnreadCount() > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-alert rounded-full animate-pulse" />
            )}
          </button>
          
          <NotificationCenter isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
        </div>

        {/* Profile Summary */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="hidden md:block text-right">
              <span className="text-xs font-semibold text-white block">{user.name}</span>
              <span className="text-[9px] text-slate-400 block">{user.email}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              {getPlanBadge(user.subscriptionPlan)}
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-brand-alert hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
