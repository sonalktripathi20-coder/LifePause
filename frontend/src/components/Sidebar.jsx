import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Lock, FolderSync, Users, 
  AlertOctagon, Activity, Clock, BarChart3, 
  CreditCard, Settings, User, LogOut, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { emergencySettings } = useAppState();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Vault', path: '/vault', icon: <Lock size={18} /> },
    { name: 'Documents', path: '/documents', icon: <FolderSync size={18} /> },
    { name: 'Contacts', path: '/contacts', icon: <Users size={18} /> },
    { name: 'Emergency', path: '/emergency', icon: <AlertOctagon size={18} /> },
    { name: 'Medical Card', path: '/medical', icon: <Activity size={18} /> },
    { name: 'Reminders', path: '/reminders', icon: <Clock size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Pricing Plans', path: '/pricing', icon: <CreditCard size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 glass border-r border-white/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="bg-brand-accent p-2 rounded-xl text-white shadow-glow-indigo">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">LifePause</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Legacy Secure</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-accent/20 to-brand-neon/5 border-l-2 border-brand-accent text-white shadow-glow-indigo/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* SOS Emergency Widget */}
        {emergencySettings?.status === 'Triggered' && (
          <div className="m-4 p-4 bg-brand-alert/15 border border-brand-alert/30 rounded-2xl animate-glow">
            <h4 className="text-xs font-bold text-brand-alert uppercase flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-brand-alert rounded-full animate-ping" />
              SOS Active
            </h4>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
              The emergency release protocol is active. Alerts sent.
            </p>
            <NavLink
              to="/emergency"
              onClick={handleLinkClick}
              className="text-[10px] font-semibold text-white bg-brand-alert/60 hover:bg-brand-alert/80 py-1 px-3 rounded-lg block text-center transition-colors"
            >
              Manage Alert
            </NavLink>
          </div>
        )}

        {emergencySettings?.status === 'Countdown' && (
          <div className="m-4 p-4 bg-brand-warning/15 border border-brand-warning/30 rounded-2xl animate-pulse">
            <h4 className="text-xs font-bold text-brand-warning uppercase flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-brand-warning rounded-full animate-ping" />
              SOS Pending
            </h4>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
              Inactivity limit hit. Countdown initiated.
            </p>
            <NavLink
              to="/emergency"
              onClick={handleLinkClick}
              className="text-[10px] font-semibold text-white bg-brand-warning/60 hover:bg-brand-warning/80 py-1 px-3 rounded-lg block text-center transition-colors"
            >
              Cancel SOS
            </NavLink>
          </div>
        )}

        {/* Logout button in sidebar footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-brand-alert hover:bg-brand-alert/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
