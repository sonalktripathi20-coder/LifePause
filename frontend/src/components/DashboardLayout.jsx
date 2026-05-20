import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppState } from '../context/AppStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const DashboardLayout = ({ children, pageTitle = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useAppState();

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden relative">
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neon/5 blur-[150px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10 relative">
        <Navbar onMobileToggle={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Premium Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 glass border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className={`p-1.5 rounded-lg ${toast.type === 'error' ? 'bg-brand-alert/15 text-brand-alert' : 'bg-brand-success/15 text-brand-success'}`}>
              {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-tight">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
