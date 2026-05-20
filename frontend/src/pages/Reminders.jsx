import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  Clock, Plus, Trash2, Calendar, FileText, CheckCircle, 
  AlertCircle, ShieldAlert, CheckSquare, Square 
} from 'lucide-react';

export const Reminders = () => {
  const { reminders, createReminder, updateReminder, deleteReminder, loading } = useAppState();

  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Insurance');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const res = await createReminder(title, category, dueDate, notes);
    if (res.success) {
      setTitle('');
      setCategory('Insurance');
      setDueDate('');
      setNotes('');
      setIsOpen(false);
    }
  };

  const getDaysDiffText = (dateStr, isCompleted) => {
    if (isCompleted) return { text: 'Completed', style: 'text-brand-success bg-brand-success/10 border-brand-success/20' };
    
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return { text: `Overdue by ${Math.abs(days)} days`, style: 'text-brand-alert bg-brand-alert/10 border-brand-alert/20 font-bold' };
    }
    if (days <= 7) {
      return { text: `Urgent: ${days} days left`, style: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20 font-bold' };
    }
    return { text: `${days} days remaining`, style: 'text-slate-400 bg-slate-900/60 border-white/5' };
  };

  const handleToggleCompleted = async (reminder) => {
    await updateReminder(reminder._id, { completed: !reminder.completed });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Insurance': return 'text-brand-success';
      case 'Passport': return 'text-brand-accent';
      case 'Subscription': return 'text-brand-neon';
      default: return 'text-brand-warning';
    }
  };

  return (
    <DashboardLayout pageTitle="Legacy Expiry Reminders">
      {/* Informational Banner */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <Clock size={16} className="text-brand-warning shrink-0" />
        <span className="text-slate-400">
          Track policy renewals, passport expiries, or locker bills. Email reminders will be dispatched automatically before deadlines.
        </span>
      </div>

      {/* Control panel */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Trackers</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">List of active and completed legacy reminders.</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-glow-indigo flex items-center gap-1"
        >
          <Plus size={14} /> Add Reminder
        </button>
      </div>

      {/* Grid list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-slate-900/40 rounded-2xl skeleton" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <div className="py-20 text-center glass rounded-3xl border border-white/5">
          <Clock size={32} className="mx-auto text-slate-600 mb-4" />
          <h4 className="text-sm font-semibold text-white">No Reminders Found</h4>
          <p className="text-xs text-slate-500 mt-1">Schedule passport renewals or car policy due dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map(reminder => {
            const dueInfo = getDaysDiffText(reminder.dueDate, reminder.completed);
            return (
              <PremiumCard key={reminder._id} hoverGlow="indigo" className={reminder.completed ? 'opacity-70' : ''}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCompleted(reminder)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {reminder.completed ? (
                        <CheckSquare size={18} className="text-brand-success" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold text-white tracking-tight ${reminder.completed ? 'line-through text-slate-500' : ''}`}>
                        {reminder.title}
                      </h4>
                      <span className={`text-[9px] font-semibold ${getCategoryColor(reminder.category)}`}>{reminder.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(reminder._id)}
                    className="p-1 text-slate-500 hover:text-brand-alert transition-colors rounded hover:bg-white/5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl space-y-2 mb-5 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Due Date</span>
                    <span className="text-slate-300 font-mono">{new Date(reminder.dueDate).toLocaleDateString()}</span>
                  </div>
                  {reminder.notes && (
                    <div className="border-t border-white/5 pt-2 mt-1">
                      <p className="text-[10px] text-slate-400 leading-normal">{reminder.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${dueInfo.style}`}>
                    {dueInfo.text}
                  </span>
                </div>
              </PremiumCard>
            );
          })}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 relative text-left">
            <h3 className="text-base font-bold text-white mb-4">Add Renewal Reminder</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Passport Renewal India"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="Insurance">Insurance</option>
                    <option value="Passport">Passport</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Locker Bills">Locker Bills</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-1.5 text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add additional details, policy IDs, or notes..."
                  rows={3}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none"
                />
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
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reminders;
