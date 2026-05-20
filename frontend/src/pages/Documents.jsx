import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  FolderSync, Search, Plus, Trash2, Calendar, FileText, 
  AlertCircle, Download, UploadCloud, CheckCircle, ShieldAlert 
} from 'lucide-react';

export const Documents = () => {
  const { documents, createDocument, deleteDocument, loading } = useAppState();

  // Filters & Searches
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Add modal fields
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wills & Trusts');
  const [fileName, setFileName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const categories = ['All', 'Wills & Trusts', 'Insurance Policies', 'Property Deeds', 'ID Cards', 'Taxes', 'Others'];

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Wills & Trusts': return 'text-brand-accent';
      case 'Insurance Policies': return 'text-brand-success';
      case 'Property Deeds': return 'text-brand-neon';
      case 'ID Cards': return 'text-brand-warning';
      default: return 'text-slate-400';
    }
  };

  const getDaysRemainingText = (expDate) => {
    if (!expDate) return { text: 'No Expiry', status: 'safe', style: 'text-slate-500 bg-slate-900/60' };
    const diff = new Date(expDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) {
      return { text: 'Expired', status: 'expired', style: 'text-brand-alert bg-brand-alert/10 border-brand-alert/20' };
    }
    if (days <= 30) {
      return { text: `Expiring: ${days} days`, status: 'warning', style: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' };
    }
    return { text: `Active: ${days} days left`, status: 'safe', style: 'text-brand-success bg-brand-success/10 border-brand-success/20' };
  };

  const handleSimulatedUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadPercent(0);

      const interval = setInterval(() => {
        setUploadPercent(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !fileName) return;

    const res = await createDocument(title, category, fileName, expiryDate, notes);
    if (res.success) {
      // Clear forms
      setTitle('');
      setCategory('Wills & Trusts');
      setFileName('');
      setExpiryDate('');
      setNotes('');
      setIsOpen(false);
    }
  };

  const handleDownload = (doc) => {
    // Simple simulated download alert
    alert(`Decryption Initiated: Downloading secure file "${doc.fileName}" under Zero-Knowledge protocol.`);
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout pageTitle="Secure Document Locker">
      {/* Encryption Banner */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <FolderSync size={16} className="text-brand-accent shrink-0" />
        <span className="text-slate-400">
          Decryption authorization is dynamically managed. Stored documents are client-side packaged and secured against server audits.
        </span>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent text-sm"
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-glow-indigo flex items-center gap-1 w-full md:w-auto justify-center"
        >
          <Plus size={14} /> Upload Document
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-brand-accent text-white shadow-lg' 
                : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredDocs.length === 0 ? (
        <div className="py-20 text-center glass rounded-3xl border border-white/5">
          <FolderSync size={32} className="mx-auto text-slate-600 mb-4" />
          <h4 className="text-sm font-semibold text-white">No Lockers Stored</h4>
          <p className="text-xs text-slate-500 mt-1">Upload trust wills, insurance policies, or tax papers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map(doc => {
            const exp = getDaysRemainingText(doc.expiryDate);
            return (
              <PremiumCard key={doc._id} hoverGlow="cyan">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                      <FileText size={16} className={getCategoryColor(doc.category)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{doc.title}</h4>
                      <span className="text-[9px] text-slate-500">{doc.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="p-1.5 text-slate-500 hover:text-brand-alert transition-colors rounded hover:bg-white/5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl space-y-2 mb-5 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">File Name</span>
                    <span className="text-slate-300 truncate max-w-[150px] font-mono">{doc.fileName}</span>
                  </div>
                  {doc.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expiry Date</span>
                      <span className="text-slate-300 font-mono">{new Date(doc.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {doc.notes && (
                    <div className="border-t border-white/5 pt-2 mt-2">
                      <span className="text-[9px] text-slate-500 block mb-0.5">Locker Notes</span>
                      <p className="text-[10px] text-slate-400 leading-normal">{doc.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Action buttons */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${exp.style}`}>
                    {exp.text}
                  </span>
                  
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1 py-1.5 px-3 bg-brand-accent/15 border border-brand-accent/30 hover:bg-brand-accent/30 text-white rounded-lg text-[10px] font-semibold transition-all"
                  >
                    <Download size={10} /> Decrypt & Save
                  </button>
                </div>
              </PremiumCard>
            );
          })}
        </div>
      )}

      {/* Add Document Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 relative text-left">
            <h3 className="text-base font-bold text-white mb-4">Secure Upload Locker</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Locker Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Life Insurance Policy 2026"
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
                    <option value="Wills & Trusts">Wills & Trusts</option>
                    <option value="Insurance Policies">Insurance Policies</option>
                    <option value="Property Deeds">Property Deeds</option>
                    <option value="ID Cards">ID Cards</option>
                    <option value="Taxes">Taxes</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-1.5 text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              {/* Upload Drop Zone Simulation */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Attach Document</label>
                {!fileName ? (
                  <div className="relative border-2 border-dashed border-white/10 hover:border-brand-accent/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/20">
                    <input
                      type="file"
                      required
                      onChange={handleSimulatedUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={28} className="mx-auto text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400 block font-medium">Select file from device</span>
                    <span className="text-[9px] text-slate-600 block mt-0.5">Supports PDF, DOC, JPG (Max 15MB)</span>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-brand-accent" />
                      <span className="text-slate-300 font-mono truncate max-w-[200px]">{fileName}</span>
                    </div>
                    {isUploading ? (
                      <span className="text-[10px] text-brand-neon font-bold animate-pulse">Uploading {uploadPercent}%</span>
                    ) : (
                      <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5">
                        <CheckCircle size={12} /> Ready
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Notes / Directives</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions for family upon emergency release..."
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
                  disabled={isUploading || !fileName}
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Documents;
