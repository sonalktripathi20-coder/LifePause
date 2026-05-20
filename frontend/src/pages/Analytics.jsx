import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  BarChart3, Shield, Activity, Calendar, Lock, CheckCircle2, 
  TrendingUp, Compass, Heart, AlertTriangle
} from 'lucide-react';

export const Analytics = () => {
  const { 
    vaultItems, documents, contacts, reminders, 
    readinessScore, securityScore 
  } = useAppState();

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  // Group vault items by category
  const categoriesCount = vaultItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const getRiskStatus = () => {
    const totalScore = (readinessScore + securityScore) / 2;
    if (totalScore >= 80) return { label: 'Extremely Safe', color: 'text-brand-success bg-brand-success/10 border-brand-success/20' };
    if (totalScore >= 50) return { label: 'Moderate Risk', color: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' };
    return { label: 'High Legacy Risk', color: 'text-brand-alert bg-brand-alert/10 border-brand-alert/20 font-bold' };
  };

  return (
    <DashboardLayout pageTitle="Advanced Legacy Analytics">
      {/* Risk and Audit Header Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PremiumCard className="flex items-center gap-4 text-left" hoverGlow="indigo">
          <div className="bg-brand-accent/20 p-3 rounded-2xl text-brand-accent shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Average Protection</span>
            <span className="text-xl font-extrabold text-white block mt-0.5">
              {Math.round((readinessScore + securityScore) / 2)}%
            </span>
          </div>
        </PremiumCard>

        <PremiumCard className="flex items-center gap-4 text-left" hoverGlow="cyan">
          <div className="bg-brand-neon/20 p-3 rounded-2xl text-brand-neon shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Audit Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border inline-block mt-1 ${getRiskStatus().color}`}>
              {getRiskStatus().label}
            </span>
          </div>
        </PremiumCard>

        <PremiumCard className="flex items-center gap-4 text-left" hoverGlow="none">
          <div className="bg-slate-900/60 p-3 rounded-2xl text-slate-400 shrink-0 border border-white/5">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Protected Digital Footprint</span>
            <span className="text-xl font-extrabold text-white block mt-0.5">
              {vaultItems.length + documents.length} Assets
            </span>
          </div>
        </PremiumCard>
      </div>

      {/* Analytics Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vault Categories distribution visual bar chart */}
        <PremiumCard hoverGlow="indigo">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Vault Distribution</h3>
          
          {vaultItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No assets in vault. Add items to see data breakdown.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(categoriesCount).map(([category, count]) => {
                const percent = Math.round((count / vaultItems.length) * 100);
                return (
                  <div key={category} className="space-y-1.5 text-left text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span className="font-semibold text-white">{category}</span>
                      <span>{count} items ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-accent transition-all duration-700" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PremiumCard>

        {/* Readiness Checklist Status breakdown */}
        <PremiumCard hoverGlow="cyan">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Redundancy Health Checks</h3>

          <div className="space-y-3.5 text-left text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-slate-300">Primary Trusted Contact</span>
              {contacts.length > 0 ? (
                <span className="text-brand-success font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> Configured</span>
              ) : (
                <span className="text-brand-alert font-bold flex items-center gap-1"><AlertTriangle size={14} /> Missing</span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-slate-300">Identity Verification Pings</span>
              {contacts.some(c => c.isVerified) ? (
                <span className="text-brand-success font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> Verified</span>
              ) : (
                <span className="text-brand-warning font-semibold flex items-center gap-1"><AlertTriangle size={14} /> Pending</span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-slate-300">Document Locker Backups</span>
              {documents.length > 0 ? (
                <span className="text-brand-success font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> {documents.length} Stored</span>
              ) : (
                <span className="text-brand-alert font-bold flex items-center gap-1"><AlertTriangle size={14} /> Empty</span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-slate-300">Emergency Instruction Directives</span>
              {vaultItems.some(i => i.category === 'Emergency Instructions') ? (
                <span className="text-brand-success font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> Configured</span>
              ) : (
                <span className="text-slate-500 font-semibold flex items-center gap-1">Not Set</span>
              )}
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Cyberpunk Activity Logs Breakdown */}
      <PremiumCard hoverGlow="none">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-left">Legacy Checklist Progress</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
            <span className="text-2xl font-bold text-white block">{vaultItems.length}</span>
            <span className="text-[10px] text-slate-500 uppercase mt-1 block">Vault Items</span>
          </div>
          <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
            <span className="text-2xl font-bold text-white block">{documents.length}</span>
            <span className="text-[10px] text-slate-500 uppercase mt-1 block">Safe Lockers</span>
          </div>
          <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
            <span className="text-2xl font-bold text-white block">{activeReminders.length}</span>
            <span className="text-[10px] text-slate-500 uppercase mt-1 block">Active Reminders</span>
          </div>
          <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
            <span className="text-2xl font-bold text-white block">{completedReminders.length}</span>
            <span className="text-[10px] text-slate-500 uppercase mt-1 block">Completed Reminders</span>
          </div>
        </div>
      </PremiumCard>
    </DashboardLayout>
  );
};

export default Analytics;
