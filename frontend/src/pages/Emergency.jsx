import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  AlertTriangle, ShieldCheck, ShieldAlert, Play, X, 
  Save, RefreshCw, Send, CheckCircle 
} from 'lucide-react';

export const Emergency = () => {
  const { user } = useAuth();
  const { 
    emergencySettings, updateEmergencySettings, triggerSOS, cancelSOS, showToast 
  } = useAppState();

  const [inactivityDays, setInactivityDays] = useState(30);
  const [emergencyNote, setEmergencyNote] = useState('');
  const [autoTrigger, setAutoTrigger] = useState(true);

  // Simulation timer state
  const [simActive, setSimActive] = useState(false);
  const [simTimeLeft, setSimTimeLeft] = useState(10);

  // Sync settings when loaded
  useEffect(() => {
    if (emergencySettings) {
      setInactivityDays(emergencySettings.inactivityDays || 30);
      setEmergencyNote(emergencySettings.emergencyNote || '');
      setAutoTrigger(emergencySettings.automaticTriggerEnabled !== false);
    }
  }, [emergencySettings]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (simActive && simTimeLeft > 0) {
      interval = setInterval(() => {
        setSimTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (simActive && simTimeLeft === 0) {
      setSimActive(false);
      handleTriggerSOS();
    }
    return () => clearInterval(interval);
  }, [simActive, simTimeLeft]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const res = await updateEmergencySettings({
      inactivityDays,
      emergencyNote,
      automaticTriggerEnabled: autoTrigger
    });
    if (res.success) {
      showToast('Emergency settings updated.');
    }
  };

  const handleTriggerSOS = async () => {
    await triggerSOS();
    showToast('SOS PROTOCOL ENGAGED! Verified contacts alerted.', 'error');
  };

  const handleCancelSOS = async () => {
    await cancelSOS();
    setSimActive(false);
    setSimTimeLeft(10);
    showToast('SOS protocol cancelled. System safe.');
  };

  const handleStartSimulation = () => {
    if (emergencySettings?.status === 'Triggered') {
      showToast('SOS protocol is already active. Reset the status first.', 'error');
      return;
    }
    setSimTimeLeft(10);
    setSimActive(true);
    showToast('Inactivity countdown simulator started (10 seconds).');
  };

  const handleStopSimulation = () => {
    setSimActive(false);
    setSimTimeLeft(10);
    showToast('Countdown cancelled. Switch remains secure.');
  };

  const getStatusBadge = () => {
    const status = emergencySettings?.status || 'Safe';
    switch (status) {
      case 'Triggered':
        return (
          <div className="p-6 bg-brand-alert/15 border-2 border-brand-alert/30 rounded-3xl animate-glow text-left flex items-start gap-4">
            <div className="p-3.5 bg-brand-alert/20 text-brand-alert rounded-2xl shrink-0">
              <ShieldAlert size={28} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Protocol Status: ACTIVATED</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Check-in verification expired. Your secure vault items are now decodable by your verified emergency heirs under Zero-Knowledge protocol rules.
              </p>
              <button
                onClick={handleCancelSOS}
                className="mt-4 px-4 py-2 bg-brand-alert text-white text-xs font-bold rounded-xl transition-all shadow-glow-alert uppercase tracking-wider"
              >
                Safe Check-In (Reset Switch)
              </button>
            </div>
          </div>
        );
      case 'Countdown':
        return (
          <div className="p-6 bg-brand-warning/15 border-2 border-brand-warning/30 rounded-3xl animate-pulse text-left flex items-start gap-4">
            <div className="p-3.5 bg-brand-warning/20 text-brand-warning rounded-2xl shrink-0">
              <AlertTriangle size={28} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Protocol Status: COUNTDOWN PENDING</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Ping responses missed. Final countdown timer running before secure key sharing releases database credentials.
              </p>
              <button
                onClick={handleCancelSOS}
                className="mt-4 px-4 py-2 bg-brand-warning text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
              >
                Reset Inactivity Clock
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-brand-success/15 border border-brand-success/30 rounded-3xl text-left flex items-start gap-4">
            <div className="p-3.5 bg-brand-success/20 text-brand-success rounded-2xl shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Protocol Status: SECURE & SAFE</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                LifePause digital monitor is active. Your inactivity timers are counting down securely in the background. System pings are scheduled.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout pageTitle="Emergency & Inactivity Triggers">
      {/* Status banner */}
      <div className="mb-8">
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left columns: Settings form */}
        <div className="lg:col-span-2 space-y-6">
          <PremiumCard hoverGlow="none">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Dead-Man Inactivity Parameters</h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Inactivity Limit Threshold</label>
                <select
                  value={inactivityDays}
                  onChange={(e) => setInactivityDays(Number(e.target.value))}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
                >
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days (Recommended)</option>
                  <option value={45}>45 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Automatic Check-in Pings</label>
                  <span className="text-[9px] text-slate-500">Triggers countdown upon failure</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={autoTrigger}
                    onChange={(e) => setAutoTrigger(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900/60 text-brand-accent focus:ring-brand-accent"
                  />
                  <span className="text-xs text-slate-300">Enable automatic dead-man inactivity switch</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Emergency Release Instruction Statement</label>
                <textarea
                  value={emergencyNote}
                  onChange={(e) => setEmergencyNote(e.target.value)}
                  placeholder="Provide instruction details or access rules for your digital heir..."
                  rows={6}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-glow-indigo"
                >
                  <Save size={14} /> Save Conditions
                </button>
              </div>
            </form>
          </PremiumCard>
        </div>

        {/* Right column: Inactivity Countdown simulator & SOS overrides */}
        <div className="space-y-6">
          {/* Simulator block */}
          <PremiumCard hoverGlow="indigo">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Inactivity Simulator</h3>
            <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
              Test how LifePause acts when check-in responses are ignored. Simulates a 10s countdown.
            </p>

            {simActive ? (
              <div className="p-5 border border-brand-warning/30 bg-brand-warning/5 rounded-2xl mb-6 text-center">
                <span className="text-[9px] text-brand-warning uppercase font-bold tracking-widest block mb-1">Inactivity countdown running</span>
                <span className="text-4xl font-extrabold text-white block font-mono animate-pulse">{simTimeLeft}s</span>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleCancelSOS}
                    className="flex-1 py-2 bg-brand-success hover:bg-brand-success/90 text-white font-bold rounded-xl text-xs"
                  >
                    Check In (I'm Safe)
                  </button>
                  <button
                    onClick={handleStopSimulation}
                    className="p-2 bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 rounded-xl"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartSimulation}
                className="w-full py-3 bg-slate-900 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 mb-6"
              >
                <Play size={12} className="text-brand-success" /> Simulate Silence Countdown
              </button>
            )}

            <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl text-[10px] text-slate-500 leading-normal text-left">
              * Verification pings simulate email alerts sent to you. If no override click occurs within the simulation, the database locks are bypassed.
            </div>
          </PremiumCard>

          {/* SOS Manual trigger */}
          <PremiumCard hoverGlow="alert" className="border-brand-alert/40 shadow-glow-alert">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">SOS Panic Trigger</h3>
            <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
              Manually engage the emergency protocol immediately. This skips countdown timers and releases key access logs.
            </p>

            <button
              onClick={handleTriggerSOS}
              className="w-full py-3 bg-gradient-to-r from-brand-alert to-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-glow-alert flex items-center justify-center gap-1.5"
            >
              <AlertTriangle size={14} /> Engage SOS Override
            </button>
          </PremiumCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Emergency;
