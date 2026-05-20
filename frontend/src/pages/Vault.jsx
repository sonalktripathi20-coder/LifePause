import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { PremiumCard } from '../components/PremiumCard';
import { 
  Lock, Search, Plus, Star, Archive, Trash2, Edit2, 
  Eye, EyeOff, ShieldAlert, Key, Landmark, FileText
} from 'lucide-react';

export const Vault = () => {
  const { user } = useAuth();
  const { 
    vaultItems, createVaultItem, updateVaultItem, deleteVaultItem,
    toggleVaultFavorite, toggleVaultArchive, loading 
  } = useAppState();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Passwords');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [pin, setPin] = useState('');
  const [notes, setNotes] = useState('');

  // Password Visibility toggler map
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpenAdd = () => {
    setTitle('');
    setCategory('Passwords');
    setUsername('');
    setPassword('');
    setAccountNo('');
    setPin('');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setUsername(item.content.username || '');
    setPassword(item.content.password || '');
    setAccountNo(item.content.accountNo || '');
    setPin(item.content.pin || '');
    setNotes(item.content.notes || '');
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const content = category === 'Passwords' 
      ? { username, password, notes }
      : category === 'Financial'
        ? { accountNo, pin, notes }
        : { notes };

    const res = await createVaultItem(title, category, content);
    if (res.success) {
      setIsAddOpen(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const content = category === 'Passwords' 
      ? { username, password, notes }
      : category === 'Financial'
        ? { accountNo, pin, notes }
        : { notes };

    const res = await updateVaultItem(selectedItem._id, { title, category, content });
    if (res.success) {
      setIsEditOpen(false);
    }
  };

  const categories = ['All', 'Passwords', 'Financial', 'Notes', 'Emergency Instructions'];

  // Filter Vault Items
  const filteredItems = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesArchive = showArchived ? item.isArchived : !item.isArchived;
    const matchesFavorite = showFavoritesOnly ? item.isFavorite : true;
    return matchesSearch && matchesCategory && matchesArchive && matchesFavorite;
  });

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Passwords': return <Key size={14} className="text-brand-accent" />;
      case 'Financial': return <Landmark size={14} className="text-brand-success" />;
      case 'Notes': return <FileText size={14} className="text-brand-neon" />;
      default: return <ShieldAlert size={14} className="text-brand-alert" />;
    }
  };

  return (
    <DashboardLayout pageTitle="Secure Vault Manager">
      {/* Zero Knowledge banner info */}
      <div className="mb-6 bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-left">
        <Lock size={16} className="text-brand-success shrink-0" />
        <span className="text-slate-400">
          Zero-Knowledge Architecture: Your encrypted data remains private and accessible only to authorized users. Admins can NOT directly access private vault content.
        </span>
      </div>

      {/* Action panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent text-sm"
          />
        </div>

        {/* Filters and Add button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showFavoritesOnly 
                ? 'bg-brand-accent/20 border-brand-accent text-white' 
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star size={12} fill={showFavoritesOnly ? '#6366F1' : 'none'} /> Favorites
          </button>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showArchived 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive size={12} /> {showArchived ? 'Active Vault' : 'Archived'}
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-glow-indigo flex items-center gap-1"
          >
            <Plus size={14} /> Add Vault Item
          </button>
        </div>
      </div>

      {/* Category selector */}
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

      {/* Items list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl p-6 h-44 skeleton" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center glass rounded-3xl border border-white/5">
          <Lock size={32} className="mx-auto text-slate-600 mb-4 animate-pulse" />
          <h4 className="text-sm font-semibold text-white">No Vault Items Found</h4>
          <p className="text-xs text-slate-500 mt-1">Add credentials or important notes to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <PremiumCard key={item._id} hoverGlow="indigo">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                    <span className="text-[9px] text-slate-500">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleVaultFavorite(item._id)}
                    className="p-1 text-slate-500 hover:text-brand-warning transition-colors"
                  >
                    <Star size={14} fill={item.isFavorite ? '#F59E0B' : 'none'} className={item.isFavorite ? 'text-brand-warning' : ''} />
                  </button>
                  <button
                    onClick={() => toggleVaultArchive(item._id)}
                    className="p-1 text-slate-500 hover:text-brand-neon transition-colors"
                    title={item.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </div>

              {/* Encrypted badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-success/15 border border-brand-success/30 rounded-full text-[9px] text-brand-success font-semibold mb-4">
                <span className="w-1 h-1 bg-brand-success rounded-full" /> Zero-Knowledge Sealed
              </div>

              {/* Data values */}
              <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl space-y-2.5 text-xs text-left mb-5">
                {item.category === 'Passwords' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Username</span>
                      <span className="text-slate-300 font-mono">{item.content.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Password</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono">
                          {visiblePasswords[item._id] ? item.content.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(item._id)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {visiblePasswords[item._id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {item.category === 'Financial' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account No.</span>
                      <span className="text-slate-300 font-mono">{item.content.accountNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Secure PIN</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono">
                          {visiblePasswords[item._id] ? item.content.pin : '••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(item._id)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {visiblePasswords[item._id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {item.content.notes && (
                  <div className="border-t border-white/5 pt-2 mt-2">
                    <span className="text-[10px] text-slate-500 block mb-0.5">Instructions</span>
                    <p className="text-[10px] text-slate-400 leading-normal">{item.content.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => deleteVaultItem(item._id)}
                  className="p-1.5 bg-brand-alert/10 hover:bg-brand-alert/20 border border-brand-alert/20 text-brand-alert rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </PremiumCard>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-base font-bold text-white mb-4">Add Secure Vault Item</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. HDFC Card"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="Passwords">Passwords</option>
                    <option value="Financial">Financial</option>
                    <option value="Notes">Notes</option>
                    <option value="Emergency Instructions">Emergency Instructions</option>
                  </select>
                </div>
              </div>

              {category === 'Passwords' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Username / ID</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="amitsharma"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              )}

              {category === 'Financial' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Account No.</label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="50100234..."
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Secure PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Insert secure passwords, details, or notes..."
                  rows={4}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs shadow-glow-indigo"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-base font-bold text-white mb-4">Edit Vault Item</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    <option value="Passwords">Passwords</option>
                    <option value="Financial">Financial</option>
                    <option value="Notes">Notes</option>
                    <option value="Emergency Instructions">Emergency Instructions</option>
                  </select>
                </div>
              </div>

              {category === 'Passwords' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Username / ID</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              )}

              {category === 'Financial' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Account No.</label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Secure PIN</label>
                    <input
                      type="text"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase">Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-brand-accent resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-xl text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Vault;
