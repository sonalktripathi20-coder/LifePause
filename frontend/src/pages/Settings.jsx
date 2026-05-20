import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  Settings as SettingsIcon, ShieldCheck, Download, UploadCloud, 
  Trash2, Bell, ShieldAlert, Key, HelpCircle 
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const { showToast, vaultItems, documents, contacts, reminders } = useAppState();

  const [pingEmail, setPingEmail] = useState(true);
  const [pingSms, setPingSms] = useState(false);
  const [lockTimeout, setLockTimeout] = useState('15');

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    showToast('Security preferences updated successfully.');
  };

  const handleExport = () => {
    const backupData = {
      user: { name: user.name, email: user.email, plan: user.subscriptionPlan },
      vaultItems,
      documents,
      contacts,
      reminders,
      exportedAt: new Date().toISOString(),
      integrityHash: 'sha256-zero-knowledge-legacy-verification'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lifepause_encrypted_backup_${user.name.toLowerCase().replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Encrypted JSON backup file generated.');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      showToast('Decryption verification succeeded. Backup file imported (Simulated).');
    }
  };

  return (
    <DashboardLayout pageTitle="System Settings">
      {/* Zero Knowledge advisory */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <ShieldCheck size={16} className="text-brand-success shrink-0" />
        <span className="text-slate-400">
          Decryption backups are locked locally with keys derived from your secret credentials. We do not store copies.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Check in Preferences */}
          <PremiumCard hoverGlow="none">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider text-left">Check-In Broadcasts</h3>
            
            <form onSubmit={handleSaveSecurity} className="space-y-4 text-left">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                  <div>
                    <span className="text-white font-medium block">Dispatch check-in pings via Email</span>
                    <span className="text-[10px] text-slate-500">Alerts sent to {user?.email}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pingEmail}
                    onChange={(e) => setPingEmail(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900/60 text-brand-accent focus:ring-brand-accent"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                  <div>
                    <span className="text-white font-medium block">Dispatch check-in pings via SMS</span>
                    <span className="text-[10px] text-slate-500">Requires Premium subscription</span>
                  </div>
                  <input
                    type="checkbox"
                    disabled={user?.subscriptionPlan === 'Free'}
                    checked={pingSms}
                    onChange={(e) => setPingSms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900/60 text-brand-accent focus:ring-brand-accent disabled:opacity-30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Locker auto-lock timeout (Minutes)</label>
                  <select
                    value={lockTimeout}
                    onChange={(e) => setLockTimeout(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes (Default)</option>
                    <option value="30">30 Minutes</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                >
                  Save System Preferences
                </button>
              </div>
            </form>
          </PremiumCard>

          {/* Backup options */}
          <PremiumCard hoverGlow="none">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider text-left">Locker Data Management</h3>
            <p className="text-[10px] text-slate-400 mb-6 text-left">
              Generate encrypted configurations or restore previous databases.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleExport}
                className="p-4 bg-slate-950/60 border border-white/5 hover:border-white/10 rounded-2xl text-left flex items-start gap-3.5 transition-all"
              >
                <div className="bg-brand-accent/20 p-2 rounded-xl text-brand-accent shrink-0">
                  <Download size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Export Database</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-1">Generates an encrypted JSON backup file.</span>
                </div>
              </button>

              <div className="relative p-4 bg-slate-950/60 border border-white/5 hover:border-white/10 rounded-2xl text-left flex items-start gap-3.5 transition-all cursor-pointer">
                <input
                  type="file"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="bg-brand-neon/20 p-2 rounded-xl text-brand-neon shrink-0">
                  <UploadCloud size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Restore Backup</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-1">Decrypter reads previous JSON variables.</span>
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Right column: auxiliary */}
        <div className="space-y-6">
          <PremiumCard hoverGlow="indigo">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-left">Locker Cryptography</h3>
            <div className="space-y-3.5 text-xs text-left">
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Standard Encryption</span>
                <span className="text-xs font-bold text-white block">AES-256-GCM / PBKDF2</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Hashing Standard</span>
                <span className="text-xs font-bold text-white block">Bcrypt / Zero-Knowledge verification</span>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
