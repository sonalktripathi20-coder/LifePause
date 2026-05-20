import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  Users, UserPlus, Trash2, Mail, ShieldCheck, Heart, 
  AlertCircle, Sparkles, CheckCircle2, ChevronRight, Check
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export const Contacts = () => {
  const { user } = useAuth();
  const { 
    contacts, createContact, deleteContact, verifyContact, loading 
  } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [permission, setPermission] = useState('Emergency Access');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const res = await createContact(name, email, phone, relationship, permission);
    if (res.success) {
      setName('');
      setEmail('');
      setPhone('');
      setIsOpen(false);
    }
  };

  const getPermissionLabelColor = (perm) => {
    switch (perm) {
      case 'Full Access': return 'text-brand-success bg-brand-success/15 border-brand-success/20';
      case 'Emergency Access': return 'text-brand-accent bg-brand-accent/15 border-brand-accent/20';
      default: return 'text-slate-400 bg-slate-900/60 border-white/5';
    }
  };

  return (
    <DashboardLayout pageTitle="Trusted Contacts & Family Setup">
      {/* Informational banner */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <Users size={16} className="text-brand-neon shrink-0" />
        <span className="text-slate-400">
          Trusted contacts receive decryption credentials only after inactivity countdown expiration or manual SOS overrides.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Contacts List */}
        <div className="lg:col-span-2 space-y-6">
          <PremiumCard hoverGlow="none">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Emergency Contacts</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Contacts who can view health stats or inherit vaults.</p>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-glow-indigo flex items-center gap-1"
              >
                <UserPlus size={14} /> Add Contact
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-20 bg-slate-900/40 rounded-xl skeleton" />
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <Users size={28} className="mx-auto text-slate-600 mb-3" />
                <h4 className="text-xs font-semibold text-white">No Trusted Contacts configured</h4>
                <p className="text-[10px] text-slate-500 mt-1">Add family members or legal heirs to secure vault releases.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map(contact => (
                  <div 
                    key={contact._id}
                    className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-white">{contact.name}</strong>
                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{contact.relationship}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-slate-400 text-xs mt-1 font-mono">
                        <span className="flex items-center gap-1"><Mail size={12} /> {contact.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getPermissionLabelColor(contact.permission)}`}>
                        {contact.permission}
                      </span>

                      {contact.isVerified ? (
                        <span className="text-[10px] text-brand-success font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyContact(contact._id)}
                          className="px-2.5 py-1 bg-brand-warning/15 hover:bg-brand-warning/20 border border-brand-warning/30 text-brand-warning text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Verify Contact
                        </button>
                      )}

                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="p-1.5 text-slate-500 hover:text-brand-alert hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PremiumCard>
        </div>

        {/* Right Side: Family Management/Upgrade */}
        <div className="space-y-6">
          {user?.subscriptionPlan === 'Family' ? (
            <PremiumCard hoverGlow="indigo">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Family Accounts</h3>
              <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                You are on the Family Plan. Invite up to 5 members to set up individual vaults and sync emergency overrides.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs text-left">
                  <div>
                    <span className="text-white font-medium block">{user.name} (You)</span>
                    <span className="text-[9px] text-slate-500">Family Owner</span>
                  </div>
                  <span className="text-brand-success font-bold text-[10px]">Active</span>
                </div>

                {user.familyMembers?.map((email, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs text-left">
                    <div>
                      <span className="text-white font-mono block truncate max-w-[150px]">{email}</span>
                      <span className="text-[9px] text-slate-500">Invited Member</span>
                    </div>
                    <span className="text-brand-accent font-bold text-[10px]">Active</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-brand-success/10 border border-brand-success/20 rounded-xl text-[10px] text-brand-success flex items-start gap-1.5 leading-relaxed">
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                Family accounts setup completes emergency coordinate systems.
              </div>
            </PremiumCard>
          ) : (
            <PremiumCard hoverGlow="none" className="border-brand-neon/40 shadow-glow-indigo">
              <div className="bg-brand-neon/10 p-2.5 rounded-2xl text-brand-neon inline-flex mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Upgrade to Family Plan</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Unlock full sync capabilities. Register up to 5 family members, configure shared legacy documents, and automate coordinated family triggers.
              </p>

              <div className="space-y-3.5 mb-6 text-left text-xs">
                <div className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Shared vaults & emergency instructions</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Multi-recipient emergency release</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Coordinated family status checks</div>
              </div>

              <button
                onClick={() => setPaymentOpen(true)}
                className="w-full py-2.5 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-1.5"
              >
                Upgrade for ₹299/mo <ChevronRight size={14} />
              </button>
            </PremiumCard>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 relative text-left">
            <h3 className="text-base font-bold text-white mb-4">Add Trusted Contact</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyan Sharma"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya.sharma@gmail.com"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Permission</label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="Viewer">Viewer (Medical Card Only)</option>
                    <option value="Emergency Access">Emergency Access (SOS Decrypt)</option>
                    <option value="Full Access">Full Access (SOS + Vault Sharing)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment simulation modal */}
      {paymentOpen && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          planName="Family"
          planPrice="₹299/month"
          familyMode={true}
        />
      )}
    </DashboardLayout>
  );
};

export default Contacts;
