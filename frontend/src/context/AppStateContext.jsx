import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider = ({ children }) => {
  const { user } = useAuth();
  const [vaultItems, setVaultItems] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [emergencySettings, setEmergencySettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [vaultRes, docRes, contactRes, reminderRes, notifyRes, emergencyRes] = await Promise.all([
        api.vault.getAll(),
        api.documents.getAll(),
        api.contacts.getAll(),
        api.reminders.getAll(),
        api.notifications.getAll(),
        api.emergency.getSettings()
      ]);

      if (vaultRes.success) setVaultItems(vaultRes.data);
      if (docRes.success) setDocuments(docRes.data);
      if (contactRes.success) setContacts(contactRes.data);
      if (reminderRes.success) setReminders(reminderRes.data);
      if (notifyRes.success) setNotifications(notifyRes.data);
      if (emergencyRes.success) setEmergencySettings(emergencyRes.data);
    } catch (err) {
      console.error('Error fetching application state:', err);
      showToast(err.message || 'Error syncing data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setVaultItems([]);
      setDocuments([]);
      setContacts([]);
      setReminders([]);
      setNotifications([]);
      setEmergencySettings(null);
    }
  }, [user, fetchAllData]);

  // Vault Actions
  const createVaultItem = async (title, category, content) => {
    try {
      const res = await api.vault.create(title, category, content);
      if (res.success) {
        setVaultItems(prev => [...prev, res.data]);
        showToast('Vault item added successfully');
        // Refresh notifications since a new activity is logged
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to create vault item', 'error');
      return { success: false, message: err.message };
    }
  };

  const updateVaultItem = async (id, fields) => {
    try {
      const res = await api.vault.update(id, fields);
      if (res.success) {
        setVaultItems(prev => prev.map(item => item._id === id ? res.data : item));
        showToast('Vault item updated');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update item', 'error');
      return { success: false, message: err.message };
    }
  };

  const deleteVaultItem = async (id) => {
    try {
      const res = await api.vault.delete(id);
      if (res.success) {
        setVaultItems(prev => prev.filter(item => item._id !== id));
        showToast('Item deleted successfully');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error');
      return { success: false, message: err.message };
    }
  };

  const toggleVaultFavorite = async (id) => {
    try {
      const res = await api.vault.toggleFavorite(id);
      if (res.success) {
        setVaultItems(prev => prev.map(item => item._id === id ? res.data : item));
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleVaultArchive = async (id) => {
    try {
      const res = await api.vault.toggleArchive(id);
      if (res.success) {
        setVaultItems(prev => prev.map(item => item._id === id ? res.data : item));
        showToast(res.data.isArchived ? 'Item archived' : 'Item unarchived');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Document Actions
  const createDocument = async (title, category, fileName, expiryDate, notes) => {
    try {
      const res = await api.documents.create(title, category, fileName, expiryDate, notes);
      if (res.success) {
        setDocuments(prev => [...prev, res.data]);
        showToast('Document uploaded successfully');
        // Refresh notifications
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload document', 'error');
      return { success: false, message: err.message };
    }
  };

  const updateDocument = async (id, fields) => {
    try {
      const res = await api.documents.update(id, fields);
      if (res.success) {
        setDocuments(prev => prev.map(d => d._id === id ? res.data : d));
        showToast('Document updated');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  const deleteDocument = async (id) => {
    try {
      const res = await api.documents.delete(id);
      if (res.success) {
        setDocuments(prev => prev.filter(d => d._id !== id));
        showToast('Document deleted');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  // Contact Actions
  const createContact = async (name, email, phone, relationship, permission) => {
    try {
      const res = await api.contacts.create(name, email, phone, relationship, permission);
      if (res.success) {
        setContacts(prev => [...prev, res.data]);
        showToast('Trusted contact added');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to add contact', 'error');
      return { success: false, message: err.message };
    }
  };

  const updateContact = async (id, fields) => {
    try {
      const res = await api.contacts.update(id, fields);
      if (res.success) {
        setContacts(prev => prev.map(c => c._id === id ? res.data : c));
        showToast('Contact updated');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await api.contacts.delete(id);
      if (res.success) {
        setContacts(prev => prev.filter(c => c._id !== id));
        showToast('Contact removed');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  const verifyContact = async (id) => {
    try {
      const res = await api.contacts.verify(id);
      if (res.success) {
        setContacts(prev => prev.map(c => c._id === id ? res.data : c));
        showToast('Contact verified (Simulated)');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Reminder Actions
  const createReminder = async (title, category, dueDate, notes) => {
    try {
      const res = await api.reminders.create(title, category, dueDate, notes);
      if (res.success) {
        setReminders(prev => [...prev, res.data]);
        showToast('Reminder added successfully');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to create reminder', 'error');
      return { success: false, message: err.message };
    }
  };

  const updateReminder = async (id, fields) => {
    try {
      const res = await api.reminders.update(id, fields);
      if (res.success) {
        setReminders(prev => prev.map(r => r._id === id ? res.data : r));
        if (fields.completed) {
          showToast('Reminder marked as completed');
        } else {
          showToast('Reminder updated');
        }
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  const deleteReminder = async (id) => {
    try {
      const res = await api.reminders.delete(id);
      if (res.success) {
        setReminders(prev => prev.filter(r => r._id !== id));
        showToast('Reminder deleted');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  // Emergency Actions
  const updateEmergencySettings = async (fields) => {
    try {
      const res = await api.emergency.updateSettings(fields);
      if (res.success) {
        setEmergencySettings(res.data);
        showToast('Emergency trigger conditions saved');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update emergency setup', 'error');
      return { success: false, message: err.message };
    }
  };

  const triggerEmergencyCountdown = async () => {
    try {
      const res = await api.emergency.triggerCountdown();
      if (res.success) {
        setEmergencySettings(res.data);
        showToast('Emergency countdown started!', 'error');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const triggerSOS = async () => {
    try {
      const res = await api.emergency.triggerSOS();
      if (res.success) {
        setEmergencySettings(res.data);
        showToast('EMERGENCY PROTOCOL ACTIVATED!', 'error');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const cancelSOS = async () => {
    try {
      const res = await api.emergency.cancelSOS();
      if (res.success) {
        setEmergencySettings(res.data);
        showToast('SOS State Reset. System Secured.');
        const notifyRes = await api.notifications.getAll();
        if (notifyRes.success) setNotifications(notifyRes.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Notifications Actions
  const markNotificationRead = async (id) => {
    try {
      const res = await api.notifications.markRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await api.notifications.markAllRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        showToast('All messages marked read');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const clearNotification = async (id) => {
    try {
      const res = await api.notifications.delete(id);
      if (res.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Scores
  const getEmergencyReadinessScore = () => {
    let score = 0;
    if (!user) return 0;

    // 1. Medical profile filled (25%)
    const med = user.medicalProfile || {};
    if (med.bloodGroup && med.allergies && med.doctorContact) score += 25;
    else if (med.bloodGroup || med.doctorContact) score += 15;

    // 2. Contacts configured (25%)
    if (contacts.length >= 1) score += 25;

    // 3. At least one contact verified (15%)
    if (contacts.some(c => c.isVerified)) score += 15;

    // 4. Emergency release notes configured (15%)
    if (emergencySettings?.emergencyNote && emergencySettings.emergencyNote.length > 20) score += 15;

    // 5. At least one vault item registered (20%)
    if (vaultItems.length >= 1) score += 20;

    return score;
  };

  const getSecurityScore = () => {
    let score = 30; // Base score
    if (!user) return 0;

    // Vault usage (max +20)
    if (vaultItems.length > 0) score += 20;

    // Documents secure (max +20)
    if (documents.length > 0) score += 20;

    // Inactivity automation set (max +30)
    if (emergencySettings?.automaticTriggerEnabled) score += 30;

    return Math.min(score, 100);
  };

  const value = {
    vaultItems,
    documents,
    contacts,
    reminders,
    notifications,
    emergencySettings,
    loading,
    toast,
    showToast,
    fetchAllData,
    createVaultItem,
    updateVaultItem,
    deleteVaultItem,
    toggleVaultFavorite,
    toggleVaultArchive,
    createDocument,
    updateDocument,
    deleteDocument,
    createContact,
    updateContact,
    deleteContact,
    verifyContact,
    createReminder,
    updateReminder,
    deleteReminder,
    updateEmergencySettings,
    triggerEmergencyCountdown,
    triggerSOS,
    cancelSOS,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    readinessScore: getEmergencyReadinessScore(),
    securityScore: getSecurityScore()
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
