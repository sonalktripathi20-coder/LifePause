import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserPlus, Heart, Key, Settings, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';

export const Onboarding = () => {
  const { user, updateMedicalProfile } = useAuth();
  const { createContact, createVaultItem, updateEmergencySettings, showToast } = useAppState();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const percentage = Math.round((step / totalSteps) * 100);

  // Step 1 State: Contact
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRelation, setContactRelation] = useState('');
  const [contactPermission, setContactPermission] = useState('Emergency Access');

  // Step 2 State: Medical
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [doctorContact, setDoctorContact] = useState('');
  const [preferredHospital, setPreferredHospital] = useState('');

  // Step 3 State: Vault
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultCategory, setVaultCategory] = useState('Passwords');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vaultNotes, setVaultNotes] = useState('');

  // Step 4 State: Emergency
  const [inactivityDays, setInactivityDays] = useState(30);
  const [emergencyNote, setEmergencyNote] = useState('This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.');

  const handleNext = async () => {
    if (step === 1) {
      if (contactName && contactEmail) {
        await createContact(contactName, contactEmail, '', contactRelation, contactPermission);
      }
    } else if (step === 2) {
      if (bloodGroup || allergies || medications || doctorContact || preferredHospital) {
        await updateMedicalProfile({ bloodGroup, allergies, medications, doctorContact, preferredHospital });
      }
    } else if (step === 3) {
      if (vaultTitle) {
        await createVaultItem(vaultTitle, vaultCategory, { username, password, notes: vaultNotes });
      }
    } else if (step === 4) {
      await updateEmergencySettings({ inactivityDays, emergencyNote });
      showToast('Onboarding completed successfully!');
      navigate('/dashboard');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSkip = () => {
    if (step === totalSteps) {
      navigate('/dashboard');
    } else {
      setStep(prev => prev + 1);
    }
  };

  const getStepIcon = (s) => {
    switch (s) {
      case 1: return <UserPlus size={20} />;
      case 2: return <Heart size={20} />;
      case 3: return <Key size={20} />;
      default: return <Settings size={20} />;
    }
  };

  const stepTitles = [
    "Add Trusted Contact",
    "Add Medical Profile",
    "Add First Vault Item",
    "Configure Emergency Switch"
  ];

  return (
    <div className="bg-brand-dark min-h-screen relative flex items-center justify-center p-4">
      {/* Background grids */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neon/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-xl glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 z-10">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Onboarding Process</span>
            <span className="text-xs font-bold text-brand-neon">{percentage}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-brand-neon transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent p-3 rounded-2xl">
              {getStepIcon(step)}
            </div>
            <div>
              <span className="text-[10px] text-brand-accent uppercase font-bold">Step {step} of 4</span>
              <h2 className="text-xl font-bold text-white leading-tight">{stepTitles[step - 1]}</h2>
            </div>
          </div>
        </div>

        <div className="min-h-[250px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Contact Form */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Add a trusted contact (spouse, sibling, lawyer) who will receive your vault access in an emergency.
                  </p>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. priya.sharma@gmail.com"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Relationship</label>
                      <input
                        type="text"
                        value={contactRelation}
                        onChange={(e) => setContactRelation(e.target.value)}
                        placeholder="e.g. Spouse"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Permission</label>
                      <select
                        value={contactPermission}
                        onChange={(e) => setContactPermission(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                      >
                        <option value="Viewer">Viewer (Medical Card Only)</option>
                        <option value="Emergency Access">Emergency Access (SOS Decrypt)</option>
                        <option value="Full Access">Full Access (SOS + Vault Sharing)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Medical Profile */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Set up your emergency medical card. This is accessible to Viewer contacts instantly in physical emergencies.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Blood Group</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        placeholder="e.g. O+"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Allergies</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Peanuts, Dust"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Current Medications</label>
                    <input
                      type="text"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="e.g. Claritin 10mg once daily"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Emergency Doctor Contact</label>
                      <input
                        type="text"
                        value={doctorContact}
                        onChange={(e) => setDoctorContact(e.target.value)}
                        placeholder="e.g. Dr. Roy (+91 ...)"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Preferred Hospital</label>
                      <input
                        type="text"
                        value={preferredHospital}
                        onChange={(e) => setPreferredHospital(e.target.value)}
                        placeholder="e.g. Apollo Hospital"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: First Vault Item */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Add your first secure item. This is locked inside your zero-knowledge inspired vault and is only decrypted on emergency triggers.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Item Title</label>
                      <input
                        type="text"
                        required
                        value={vaultTitle}
                        onChange={(e) => setVaultTitle(e.target.value)}
                        placeholder="e.g. HDFC Debit Card PIN"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
                      <select
                        value={vaultCategory}
                        onChange={(e) => setVaultCategory(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                      >
                        <option value="Passwords">Passwords</option>
                        <option value="Financial">Financial</option>
                        <option value="Notes">Notes</option>
                        <option value="Emergency Instructions">Emergency Instructions</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Username / ID (Optional)</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="amitsharma"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Secret PIN / Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Notes / Instructions</label>
                    <textarea
                      value={vaultNotes}
                      onChange={(e) => setVaultNotes(e.target.value)}
                      placeholder="Add secure details or pins here..."
                      rows={2}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Emergency Trigger settings */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Set up your automatic dead-man inactivity timeline. Note: Inactivity checks can only be enabled on Premium plans.
                  </p>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Inactivity Limit (Days)</label>
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
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Release Instruction Note</label>
                    <textarea
                      value={emergencyNote}
                      onChange={(e) => setEmergencyNote(e.target.value)}
                      placeholder="Write your release statement..."
                      rows={4}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center border-t border-white/5 pt-6">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-300 font-semibold"
            >
              Skip Step
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl transition-all text-xs flex items-center gap-1"
            >
              {step === totalSteps ? 'Complete Onboarding' : 'Next Step'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
