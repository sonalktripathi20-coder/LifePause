import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  ShieldCheck, AlertTriangle, Users, FolderSync, Clock, 
  Sparkles, CheckCircle2, AlertOctagon, HelpCircle, Eye,
  Lock, ArrowRight, HeartPulse, ShieldAlert
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const { 
    vaultItems, documents, contacts, reminders, notifications,
    readinessScore, securityScore, emergencySettings 
  } = useAppState();
  const navigate = useNavigate();

  const [paymentOpen, setPaymentOpen] = useState(false);

  // Compute stats
  const totalVault = vaultItems.length;
  const totalDocs = documents.length;
  const totalContacts = contacts.length;
  const verifiedContacts = contacts.filter(c => c.isVerified).length;
  const pendingReminders = reminders.filter(r => !r.completed).length;

  // Filter soon expiring docs/reminders (within 30 days)
  const expiringDocs = documents.filter(d => {
    if (!d.expiryDate) return false;
    const diff = new Date(d.expiryDate) - new Date();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  const activeReminders = reminders.filter(r => {
    if (r.completed) return false;
    const diff = new Date(r.dueDate) - new Date();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  // Calculate vault usage message
  const getVaultUsageText = () => {
    if (user?.subscriptionPlan === 'Free') {
      return `${totalVault} / 5 Items`;
    }
    return `${totalVault} / Unlimited`;
  };

  const getVaultProgressPercent = () => {
    if (user?.subscriptionPlan === 'Free') {
      return (totalVault / 5) * 100;
    }
    return 100;
  };

  const getSmartInsights = () => {
    const insights = [];
    if (readinessScore < 80) {
      insights.push({
        text: `Your emergency readiness is at ${readinessScore}%. Complete onboarding to secure your legacy.`,
        action: 'Onboard Now',
        link: '/medical'
      });
    }
    if (contacts.length === 0) {
      insights.push({
        text: "You haven't added any trusted contacts. In case of emergency, who gets access?",
        action: 'Add Contact',
        link: '/contacts'
      });
    } else if (contacts.length === 1 && user?.subscriptionPlan !== 'Free') {
      insights.push({
        text: "Add at least one more backup contact for a highly secure legacy release setup.",
        action: 'Configure Backup',
        link: '/contacts'
      });
    }
    if (expiringDocs.length > 0) {
      insights.push({
        text: `${expiringDocs.length} important document(s) expire soon. Review them immediately.`,
        action: 'Review Locker',
        link: '/documents'
      });
    }
    if (vaultItems.length === 0) {
      insights.push({
        text: "Your secure vault is empty. Store banking details or instructions.",
        action: 'Secure First Item',
        link: '/vault'
      });
    }
    return insights.slice(0, 3);
  };

  return (
    <DashboardLayout pageTitle="Dashboard Summary">
      {/* Smart Alert Banner if emergency active */}
      {(emergencySettings?.status === 'Triggered' || emergencySettings?.status === 'Countdown') && (
        <div className="mb-8 p-5 bg-brand-alert/15 border-2 border-brand-alert/30 rounded-3xl animate-glow flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="p-3 bg-brand-alert/20 rounded-2xl text-brand-alert shrink-0">
              <ShieldAlert size={24} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {emergencySettings.status === 'Triggered' ? 'Emergency Protocol Live' : 'Emergency Countdown Pending'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {emergencySettings.status === 'Triggered' 
                  ? 'Verification checks failed. Encryption keys are released to verified emergency contacts.'
                  : 'Inactivity limits hit. Security countdown initiated. Access your settings to reset status.'}
              </p>
            </div>
          </div>
          <Link
            to="/emergency"
            className="px-5 py-2.5 bg-brand-alert hover:bg-brand-alert/90 text-white text-xs font-bold rounded-xl transition-all shadow-glow-alert uppercase tracking-wider shrink-0"
          >
            Manage Override
          </Link>
        </div>
      )}

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Readiness Circular gauge */}
        <PremiumCard className="flex flex-col items-center justify-between text-center relative md:col-span-1" hoverGlow="indigo">
          <span className="text-xs text-slate-400 font-semibold mb-3">Readiness Score</span>
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#6366F1" strokeWidth="6" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xl font-bold text-white">{readinessScore}%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4">Calculated from health records, contact status, and release rules.</p>
        </PremiumCard>

        {/* Security Gauge */}
        <PremiumCard className="flex flex-col items-center justify-between text-center relative md:col-span-1" hoverGlow="cyan">
          <span className="text-xs text-slate-400 font-semibold mb-3">Security Integrity</span>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke="#06B6D4" strokeWidth="6" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * securityScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xl font-bold text-white">{securityScore}%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4">Based on locker usage, multi-factor triggers, and audits.</p>
        </PremiumCard>

        {/* Vault Usage & Details */}
        <PremiumCard className="flex flex-col justify-between text-left md:col-span-2" hoverGlow="none">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400 font-semibold">Vault Storage Allocation</span>
              <Lock size={14} className="text-brand-accent" />
            </div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold text-white">{getVaultUsageText()}</span>
              <span className="text-xs text-slate-500">Plan limit</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-brand-accent to-brand-neon rounded-full transition-all duration-700" 
                style={{ width: `${getVaultProgressPercent()}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 border border-white/5 p-3.5 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-brand-neon" size={16} />
              <div>
                <span className="text-white font-medium block">Emergency Release Mode</span>
                <span className="text-[10px] text-slate-500">
                  {emergencySettings?.automaticTriggerEnabled ? 'Automatic Check-ins enabled' : 'Manual SOS only'}
                </span>
              </div>
            </div>
            <Link to="/emergency" className="text-brand-accent hover:underline flex items-center gap-0.5">
              Setup <ArrowRight size={12} />
            </Link>
          </div>
        </PremiumCard>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Smart Suggestions & Expiring items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Suggestion Insights Banner */}
          <PremiumCard hoverGlow="indigo">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Critical Preparedness Actions</h3>
            <div className="space-y-3.5">
              {getSmartInsights().length === 0 ? (
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-center text-xs text-slate-500">
                  Your Digital Legacy is 100% configured. Excellent work!
                </div>
              ) : (
                getSmartInsights().map((insight, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-between gap-4 text-xs">
                    <p className="text-slate-300 font-medium leading-relaxed text-left">{insight.text}</p>
                    <Link
                      to={insight.link}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      {insight.action}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </PremiumCard>

          {/* Upcoming Expiries & Trackers */}
          <PremiumCard hoverGlow="cyan">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Expiring Documents & Bills</h3>
              <Clock size={16} className="text-brand-warning" />
            </div>
            <div className="space-y-3">
              {expiringDocs.length === 0 && activeReminders.length === 0 ? (
                <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-center text-xs text-slate-500">
                  No expiring documents or due bills within the next 30 days.
                </div>
              ) : (
                <>
                  {expiringDocs.map(d => (
                    <div key={d._id} className="p-3 bg-brand-alert/5 border border-brand-alert/10 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-medium block">{d.title}</span>
                        <span className="text-[10px] text-slate-500">Document Expiration</span>
                      </div>
                      <span className="text-brand-alert font-semibold">Expires: {new Date(d.expiryDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {activeReminders.map(r => (
                    <div key={r._id} className="p-3 bg-brand-warning/5 border border-brand-warning/10 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-medium block">{r.title}</span>
                        <span className="text-[10px] text-slate-500">{r.category} due date</span>
                      </div>
                      <span className="text-brand-warning font-semibold">Due: {new Date(r.dueDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </PremiumCard>
        </div>

        {/* Right column: Trusted Contacts & Subscription & Activities */}
        <div className="space-y-6">
          {/* Subscription widget */}
          <PremiumCard hoverGlow="none">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400 font-semibold">Subscription Status</span>
              <Sparkles size={14} className="text-brand-accent animate-pulse" />
            </div>

            <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl text-left mb-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Active Plan</span>
              <span className="text-lg font-bold text-white block mt-0.5">{user?.subscriptionPlan || 'Free'} Plan</span>
              {user?.subscriptionPlan === 'Free' ? (
                <button
                  onClick={() => setPaymentOpen(true)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-1.5"
                >
                  Upgrade Account <ArrowRight size={12} />
                </button>
              ) : (
                <span className="text-[10px] text-brand-success font-semibold flex items-center gap-1 mt-2.5">
                  <CheckCircle2 size={12} /> Billing cycle is active
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                <span className="text-xs font-semibold text-white block">{totalContacts}</span>
                <span className="text-[9px] text-slate-500 uppercase mt-0.5 block">Contacts</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                <span className="text-xs font-semibold text-white block">{verifiedContacts}</span>
                <span className="text-[9px] text-slate-500 uppercase mt-0.5 block">Verified</span>
              </div>
            </div>
          </PremiumCard>

          {/* Activity feed */}
          <PremiumCard hoverGlow="none">
            <span className="text-xs text-slate-400 font-semibold block mb-4">Audit Logs / Recent Activity</span>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {notifications.slice(0, 4).map((n) => (
                <div key={n._id} className="text-left border-l-2 border-white/10 pl-3 py-0.5">
                  <span className="text-[10px] font-bold text-slate-300 block">{n.title}</span>
                  <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">{n.message}</span>
                  <span className="text-[8px] text-slate-600 block mt-0.5">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {notifications.length === 0 && (
                <span className="text-xs text-slate-500">No activity logged yet.</span>
              )}
            </div>
          </PremiumCard>
        </div>
      </div>

      {paymentOpen && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          planName="Premium"
          planPrice="₹99/month"
          familyMode={false}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
