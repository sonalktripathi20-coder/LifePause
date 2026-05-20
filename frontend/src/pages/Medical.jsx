import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  Heart, ShieldAlert, Award, FileText, Phone,
  Plus, Edit3, CheckCircle, Printer 
} from 'lucide-react';

export const Medical = () => {
  const { user, updateMedicalProfile } = useAuth();
  const { showToast } = useAppState();

  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const med = user?.medicalProfile || {};
  const [bloodGroup, setBloodGroup] = useState(med.bloodGroup || '');
  const [allergies, setAllergies] = useState(med.allergies || '');
  const [medications, setMedications] = useState(med.medications || '');
  const [doctorContact, setDoctorContact] = useState(med.doctorContact || '');
  const [preferredHospital, setPreferredHospital] = useState(med.preferredHospital || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateMedicalProfile({
      bloodGroup, allergies, medications, doctorContact, preferredHospital
    });
    if (res.success) {
      showToast('Medical profile updated successfully');
      setIsEditing(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout pageTitle="Emergency Medical Card">
      {/* Bio banner */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <Heart size={16} className="text-brand-alert shrink-0 animate-pulse" />
        <span className="text-slate-400">
          This Emergency Card is accessible to emergency personnel and designated 'Viewer' contacts. Keep details accurate.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Medical Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <PremiumCard hoverGlow="none">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Health Details</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Configure clinical variables for emergency use cases.</p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 bg-slate-900 border border-white/10 hover:border-white/20 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                >
                  <Edit3 size={12} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Blood Group</label>
                    <input
                      type="text"
                      required
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="e.g. O+"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Drug / Food Allergies</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Active Medications</label>
                  <textarea
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="e.g. Metformin 500mg daily"
                    rows={2}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Doctor Contact No.</label>
                    <input
                      type="text"
                      value={doctorContact}
                      onChange={(e) => setDoctorContact(e.target.value)}
                      placeholder="Dr. Roy (+91 9901...)"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Preferred Hospital</label>
                    <input
                      type="text"
                      value={preferredHospital}
                      onChange={(e) => setPreferredHospital(e.target.value)}
                      placeholder="Apollo Hospital"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                  >
                    Save Medical Card
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Blood Group</span>
                  <span className="text-xl font-bold text-white block">{med.bloodGroup || 'Not Configured'}</span>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Allergies</span>
                  <span className="text-sm font-bold text-brand-alert block">{med.allergies || 'None Reported'}</span>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl sm:col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Active Medications</span>
                  <p className="text-xs text-slate-300 leading-normal">{med.medications || 'None'}</p>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Emergency Physician</span>
                  <span className="text-xs font-semibold text-white block flex items-center gap-1.5 mt-1">
                    <Phone size={12} className="text-brand-success" /> {med.doctorContact || 'Not Specified'}
                  </span>
                </div>
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Preferred Hospital</span>
                  <span className="text-xs font-semibold text-white block mt-1">{med.preferredHospital || 'Not Specified'}</span>
                </div>
              </div>
            )}
          </PremiumCard>
        </div>

        {/* Right column: Simulated Printable Physical Health Card */}
        <div className="space-y-6">
          <PremiumCard hoverGlow="indigo" className="bg-gradient-to-tr from-slate-900 to-slate-950">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-slate-400 font-semibold">Simulated ID Badge</span>
              <button
                onClick={handlePrint}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded bg-slate-900 border border-white/5"
                title="Print Card"
              >
                <Printer size={12} />
              </button>
            </div>

            {/* Simulated Badge Card Wrapper */}
            <div className="p-5 border border-white/10 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 relative overflow-hidden shadow-2xl text-left font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-alert/5 rounded-full blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase leading-none">LifePause Health Card</h4>
                  <span className="text-[8px] text-slate-500 font-mono">EMERGENCY ACCESS PASS</span>
                </div>
                <Heart size={16} className="text-brand-alert animate-pulse" />
              </div>

              {/* Content Grid */}
              <div className="space-y-3">
                <div>
                  <span className="text-[8px] text-slate-500 uppercase block">Cardholder Name</span>
                  <span className="text-xs font-bold text-white block">{user?.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase block">Blood Type</span>
                    <span className="text-xs font-bold text-brand-alert block">{med.bloodGroup || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase block">Allergies</span>
                    <span className="text-xs font-bold text-brand-warning block truncate max-w-[100px]">{med.allergies || 'None'}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/10 pt-2.5">
                  <span className="text-[8px] text-slate-500 uppercase block">Emergency Verification Code</span>
                  {/* Fake barcode simulation using css borders */}
                  <div className="h-6 flex items-stretch gap-0.5 mt-1.5 bg-white p-1 rounded">
                    {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 4, 1, 2].map((w, idx) => (
                      <span key={idx} className="bg-black" style={{ flexGrow: w }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[9px] text-slate-500 leading-normal block">
                Paramedics can scan the verification barcode to download metadata safely when the SOS state changes to active.
              </span>
            </div>
          </PremiumCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Medical;
