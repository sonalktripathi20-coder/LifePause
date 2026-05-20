import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, CheckCircle, Info, Calendar, Trash2, CheckCheck } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useAppState();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="text-brand-warning" size={16} />;
      case 'emergency':
        return <ShieldAlert className="text-brand-alert animate-pulse" size={16} />;
      case 'expiry':
        return <Calendar className="text-brand-neon" size={16} />;
      case 'payment':
        return <CheckCircle className="text-brand-success" size={16} />;
      default:
        return <Info className="text-brand-accent" size={16} />;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 text-left"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-brand-accent" />
          <span className="font-bold text-white text-sm">Notifications</span>
          {getUnreadCount() > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-alert text-white rounded-full">
              {getUnreadCount()} new
            </span>
          )}
        </div>
        {getUnreadCount() > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-[11px] text-brand-neon hover:underline"
          >
            <CheckCheck size={12} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => !n.isRead && markNotificationRead(n._id)}
                className={`p-3.5 flex gap-3 cursor-pointer hover:bg-white/5 transition-all relative ${
                  !n.isRead ? 'bg-brand-accent/5' : ''
                }`}
              >
                {/* Unread dot */}
                {!n.isRead && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                )}

                <div className="mt-0.5 shrink-0 bg-slate-900/80 p-1.5 rounded-lg border border-white/5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[9px] text-slate-500 block mt-1">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(n._id);
                  }}
                  className="text-slate-500 hover:text-brand-alert p-1 self-start rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-2 border-t border-white/5 text-center bg-slate-950/20">
        <span className="text-[10px] text-slate-500">Security Audit Logs Encrypted</span>
      </div>
    </div>
  );
};

export default NotificationCenter;
