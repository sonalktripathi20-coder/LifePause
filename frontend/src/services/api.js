// API Integration service for LifePause
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to check if backend is reachable
let useLocalStorageMode = false;
let verifiedConnection = false;

const checkBackendConnection = async () => {
  if (verifiedConnection) return !useLocalStorageMode;
  try {
    const res = await fetch(`${BASE_URL.replace('/api', '')}`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    const data = await res.json();
    if (data.status === 'online') {
      console.log('LifePause Backend connected successfully. Running in Live mode.');
      useLocalStorageMode = false;
    } else {
      console.warn('Backend returned invalid response. Falling back to Demo (localStorage) mode.');
      useLocalStorageMode = true;
    }
  } catch (error) {
    console.warn('LifePause Backend is offline. Running in Demo (localStorage) mode.');
    useLocalStorageMode = true;
  }
  verifiedConnection = true;
  return !useLocalStorageMode;
};

// Start connection check immediately
checkBackendConnection();

// Initial seed data generator for Local Storage Mode
const initLocalStorageDB = () => {
  if (!localStorage.getItem('lp_users')) {
    localStorage.setItem('lp_users', JSON.stringify([]));
  }
  if (!localStorage.getItem('lp_vault')) {
    localStorage.setItem('lp_vault', JSON.stringify([
      {
        _id: 'v1',
        owner: 'user1',
        title: 'Emergency Medical Plan',
        category: 'Emergency Instructions',
        content: { note: 'In case of hospitalization, please contact Dr. Vikram Roy at Apollo Hospital. Insurance card is in the Doc Locker.' },
        isFavorite: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'v2',
        owner: 'user1',
        title: 'HDFC Family Savings Account Pin',
        category: 'Financial',
        content: { accountNo: '50100432890123', pin: '****', notes: 'Password is in our shared lockbox.' },
        isFavorite: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'v3',
        owner: 'user1',
        title: 'Main Gmail Account credentials',
        category: 'Passwords',
        content: { username: 'sharma.amit@gmail.com', password: '•••••••••••••', notes: 'Includes recovery key: lp-recovery-4829-9923' },
        isFavorite: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('lp_docs')) {
    localStorage.setItem('lp_docs', JSON.stringify([
      {
        _id: 'd1',
        owner: 'user1',
        title: 'Passport Copy - Amit',
        category: 'Identity',
        fileName: 'passport_amit_signed.pdf',
        fileUrl: '#',
        expiryDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Renewed in 2024. Original in steel safe.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'd2',
        owner: 'user1',
        title: 'Nippon Life Health Policy',
        category: 'Insurance',
        fileName: 'nippon_health_2025.pdf',
        fileUrl: '#',
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Covers up to ₹10 Lakhs for family of 4.',
        createdAt: new Date().toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('lp_contacts')) {
    localStorage.setItem('lp_contacts', JSON.stringify([
      {
        _id: 'c1',
        owner: 'user1',
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        phone: '+91 98765 43210',
        relationship: 'Spouse',
        permission: 'Full Access',
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'c2',
        owner: 'user1',
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@yahoo.com',
        phone: '+91 98234 56789',
        relationship: 'Brother',
        permission: 'Emergency Access',
        isVerified: false,
        createdAt: new Date().toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('lp_reminders')) {
    localStorage.setItem('lp_reminders', JSON.stringify([
      {
        _id: 'r1',
        owner: 'user1',
        title: 'Term Life Insurance Premium',
        category: 'Insurance',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Annual premium due. Auto-debit set.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'r2',
        owner: 'user1',
        title: 'HDFC Credit Card Bill',
        category: 'Bills',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Pay through CRED.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'r3',
        owner: 'user1',
        title: 'Broadband Plan Renewal',
        category: 'Subscription',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Airtel Fiber renewal.',
        completed: true,
        createdAt: new Date().toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('lp_notifications')) {
    localStorage.setItem('lp_notifications', JSON.stringify([
      {
        _id: 'n1',
        owner: 'user1',
        title: 'LifePause System Active',
        message: 'Your emergency vault setup is ready. Complete onboarding to enable full security controls.',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'n2',
        owner: 'user1',
        title: 'Insurance Expiry Approaching',
        message: 'Your document "Nippon Life Health Policy" is expiring in 15 days.',
        type: 'expiry',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('lp_emergency')) {
    localStorage.setItem('lp_emergency', JSON.stringify({
      user1: {
        owner: 'user1',
        inactivityDays: 30,
        automaticTriggerEnabled: false,
        emergencyNote: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.',
        status: 'Inactive',
        countdownStart: null
      }
    }));
  }
};

initLocalStorageDB();

// Helper to simulate request delay in local storage mode
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// HTTP Request Helper
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('lp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// API Services
export const api = {
  // Check Mode
  isOfflineMode: () => useLocalStorageMode,

  // Auth Endpoints
  auth: {
    register: async (name, email, password) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password })
        });
      } else {
        await delay();
        const users = JSON.parse(localStorage.getItem('lp_users'));
        if (users.find(u => u.email === email)) {
          throw new Error('User already exists in simulation database.');
        }

        const newUser = {
          _id: 'user_' + Math.random().toString(36).substring(2, 9),
          name,
          email,
          subscriptionPlan: 'Free',
          familyMembers: [],
          medicalProfile: {
            bloodGroup: '',
            allergies: '',
            medications: '',
            doctorContact: '',
            preferredHospital: ''
          },
          createdAt: new Date().toISOString()
        };
        users.push({ ...newUser, password }); // Store raw password for mock auth
        localStorage.setItem('lp_users', JSON.stringify(users));

        // Create default emergency settings
        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        emergency[newUser._id] = {
          owner: newUser._id,
          inactivityDays: 30,
          automaticTriggerEnabled: false,
          emergencyNote: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.',
          status: 'Inactive',
          countdownStart: null
        };
        localStorage.setItem('lp_emergency', JSON.stringify(emergency));

        return { success: true, token: 'mock_token_' + newUser._id, user: newUser };
      }
    },

    login: async (email, password) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      } else {
        await delay();
        const users = JSON.parse(localStorage.getItem('lp_users'));
        // Fallback default admin user if list is empty
        if (users.length === 0 && email === 'demo@lifepause.in' && password === 'password') {
          const defaultUser = {
            _id: 'user1',
            name: 'Amit Sharma',
            email: 'demo@lifepause.in',
            subscriptionPlan: 'Free',
            familyMembers: [],
            medicalProfile: {
              bloodGroup: 'O+',
              allergies: 'Peanuts, Dust',
              medications: 'Claritin 10mg daily',
              doctorContact: 'Dr. Vikram Roy (+91 94321 09876)',
              preferredHospital: 'Apollo Hospital, New Delhi'
            },
            createdAt: new Date().toISOString()
          };
          users.push({ ...defaultUser, password: 'password' });
          localStorage.setItem('lp_users', JSON.stringify(users));
        }

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password in simulation database.');
        }

        // Add login notification
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: user._id,
          title: 'New Login Detected (Demo Mode)',
          message: `Logged in from browser at ${new Date().toLocaleString()}`,
          type: 'security',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        const userObj = { ...user };
        delete userObj.password;
        return { success: true, token: 'mock_token_' + user._id, user: userObj };
      }
    },

    getMe: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/me');
      } else {
        const token = localStorage.getItem('lp_token');
        if (!token || !token.startsWith('mock_token_')) {
          throw new Error('Not logged in (Demo Mode)');
        }
        const userId = token.replace('mock_token_', '');
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const user = users.find(u => u._id === userId);
        if (!user) throw new Error('Session expired');
        const userObj = { ...user };
        delete userObj.password;
        return { success: true, user: userObj };
      }
    },

    updateMedical: async (profileData) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/medical', {
          method: 'PUT',
          body: JSON.stringify(profileData)
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token.replace('mock_token_', '');
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const userIndex = users.findIndex(u => u._id === userId);
        if (userIndex === -1) throw new Error('User not found');

        users[userIndex].medicalProfile = {
          ...users[userIndex].medicalProfile,
          ...profileData
        };
        localStorage.setItem('lp_users', JSON.stringify(users));

        // Add Notification
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'Medical Card Configured',
          message: 'Your emergency health profile has been updated.',
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        const userObj = { ...users[userIndex] };
        delete userObj.password;
        return { success: true, user: userObj };
      }
    },

    updateSubscription: async (plan, familyMembers = []) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/subscription', {
          method: 'PUT',
          body: JSON.stringify({ plan, familyMembers })
        });
      } else {
        await delay(1000); // Simulate transaction processing
        const token = localStorage.getItem('lp_token');
        const userId = token.replace('mock_token_', '');
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const userIndex = users.findIndex(u => u._id === userId);
        if (userIndex === -1) throw new Error('User not found');

        users[userIndex].subscriptionPlan = plan;
        users[userIndex].familyMembers = familyMembers;
        localStorage.setItem('lp_users', JSON.stringify(users));

        // Add Payment Notification
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'Payment Successful',
          message: `Your subscription is active. Upgraded to ${plan} Plan successfully.`,
          type: 'payment',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        const userObj = { ...users[userIndex] };
        delete userObj.password;
        return { success: true, user: userObj };
      }
    },

    forgotPassword: async (email) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      } else {
        await delay();
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const user = users.find(u => u.email === email);
        if (!user) throw new Error('No account registered with that email.');
        return { success: true, message: 'Password reset instructions sent. (Demo code: RESET123)' };
      }
    },

    resetPassword: async (email, code, newPassword) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email, code, newPassword })
        });
      } else {
        await delay();
        if (code !== 'RESET123') throw new Error('Invalid verification code.');
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) throw new Error('User not found.');

        users[userIndex].password = newPassword;
        localStorage.setItem('lp_users', JSON.stringify(users));
        return { success: true, message: 'Password has been successfully updated.' };
      }
    }
  },

  // Vault Endpoints
  vault: {
    getAll: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/vault');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const items = vault.filter(item => item.owner === userId);
        return { success: true, count: items.length, data: items };
      }
    },

    create: async (title, category, content) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/vault', {
          method: 'POST',
          body: JSON.stringify({ title, category, content })
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';

        // Limit Check for Free Plan
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const currentUser = users.find(u => u._id === userId) || { subscriptionPlan: 'Free' };
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const myItems = vault.filter(v => v.owner === userId);

        if (currentUser.subscriptionPlan === 'Free' && myItems.length >= 5) {
          throw new Error('Free Plan limit reached (Max 5 vault items). Please upgrade to Premium.');
        }

        const newItem = {
          _id: 'val_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title,
          category,
          content,
          isFavorite: false,
          isArchived: false,
          createdAt: new Date().toISOString()
        };

        vault.push(newItem);
        localStorage.setItem('lp_vault', JSON.stringify(vault));
        return { success: true, data: newItem };
      }
    },

    update: async (id, updatedFields) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/vault/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedFields)
        });
      } else {
        await delay();
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const index = vault.findIndex(v => v._id === id);
        if (index === -1) throw new Error('Item not found');

        vault[index] = { ...vault[index], ...updatedFields };
        localStorage.setItem('lp_vault', JSON.stringify(vault));
        return { success: true, data: vault[index] };
      }
    },

    delete: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/vault/${id}`, { method: 'DELETE' });
      } else {
        await delay();
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const newVault = vault.filter(v => v._id !== id);
        localStorage.setItem('lp_vault', JSON.stringify(newVault));
        return { success: true, message: 'Vault item deleted' };
      }
    },

    toggleFavorite: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/vault/${id}/favorite`, { method: 'PUT' });
      } else {
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const index = vault.findIndex(v => v._id === id);
        if (index === -1) throw new Error('Item not found');

        vault[index].isFavorite = !vault[index].isFavorite;
        localStorage.setItem('lp_vault', JSON.stringify(vault));
        return { success: true, data: vault[index] };
      }
    },

    toggleArchive: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/vault/${id}/archive`, { method: 'PUT' });
      } else {
        const vault = JSON.parse(localStorage.getItem('lp_vault'));
        const index = vault.findIndex(v => v._id === id);
        if (index === -1) throw new Error('Item not found');

        vault[index].isArchived = !vault[index].isArchived;
        localStorage.setItem('lp_vault', JSON.stringify(vault));
        return { success: true, data: vault[index] };
      }
    }
  },

  // Documents Endpoints
  documents: {
    getAll: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/documents');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const docs = JSON.parse(localStorage.getItem('lp_docs'));
        const items = docs.filter(doc => doc.owner === userId);
        return { success: true, count: items.length, data: items };
      }
    },

    create: async (title, category, fileName, expiryDate, notes) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/documents', {
          method: 'POST',
          body: JSON.stringify({ title, category, fileName, expiryDate, notes })
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';

        // Limit Check for Free Plan
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const currentUser = users.find(u => u._id === userId) || { subscriptionPlan: 'Free' };
        const docs = JSON.parse(localStorage.getItem('lp_docs'));
        const myDocs = docs.filter(d => d.owner === userId);

        if (currentUser.subscriptionPlan === 'Free' && myDocs.length >= 2) {
          throw new Error('Free Plan limit reached (Max 2 documents). Please upgrade to Premium.');
        }

        const newDoc = {
          _id: 'doc_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title,
          category,
          fileName,
          fileUrl: '#',
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
          notes,
          createdAt: new Date().toISOString()
        };

        docs.push(newDoc);
        localStorage.setItem('lp_docs', JSON.stringify(docs));

        if (expiryDate) {
          const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
          notifications.unshift({
            _id: 'n_' + Math.random().toString(36).substring(2, 9),
            owner: userId,
            title: 'Document Expiry Tracked',
            message: `You will be notified prior to "${title}" expiration on ${new Date(expiryDate).toLocaleDateString()}.`,
            type: 'expiry',
            isRead: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('lp_notifications', JSON.stringify(notifications));
        }

        return { success: true, data: newDoc };
      }
    },

    update: async (id, updatedFields) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/documents/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedFields)
        });
      } else {
        await delay();
        const docs = JSON.parse(localStorage.getItem('lp_docs'));
        const index = docs.findIndex(d => d._id === id);
        if (index === -1) throw new Error('Document not found');

        docs[index] = { ...docs[index], ...updatedFields };
        localStorage.setItem('lp_docs', JSON.stringify(docs));
        return { success: true, data: docs[index] };
      }
    },

    delete: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/documents/${id}`, { method: 'DELETE' });
      } else {
        await delay();
        const docs = JSON.parse(localStorage.getItem('lp_docs'));
        const newDocs = docs.filter(d => d._id !== id);
        localStorage.setItem('lp_docs', JSON.stringify(newDocs));
        return { success: true, message: 'Document deleted' };
      }
    }
  },

  // Contacts Endpoints
  contacts: {
    getAll: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/contacts');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const contacts = JSON.parse(localStorage.getItem('lp_contacts'));
        const items = contacts.filter(c => c.owner === userId);
        return { success: true, count: items.length, data: items };
      }
    },

    create: async (name, email, phone, relationship, permission) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/contacts', {
          method: 'POST',
          body: JSON.stringify({ name, email, phone, relationship, permission })
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';

        // Limit Check for Free Plan
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const currentUser = users.find(u => u._id === userId) || { subscriptionPlan: 'Free' };
        const contacts = JSON.parse(localStorage.getItem('lp_contacts'));
        const myContacts = contacts.filter(c => c.owner === userId);

        if (currentUser.subscriptionPlan === 'Free' && myContacts.length >= 1) {
          throw new Error('Free Plan limit reached (Max 1 contact). Please upgrade to Premium.');
        }

        const newContact = {
          _id: 'con_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          name,
          email,
          phone,
          relationship,
          permission,
          isVerified: false,
          createdAt: new Date().toISOString()
        };

        contacts.push(newContact);
        localStorage.setItem('lp_contacts', JSON.stringify(contacts));
        return { success: true, data: newContact };
      }
    },

    update: async (id, updatedFields) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/contacts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedFields)
        });
      } else {
        await delay();
        const contacts = JSON.parse(localStorage.getItem('lp_contacts'));
        const index = contacts.findIndex(c => c._id === id);
        if (index === -1) throw new Error('Contact not found');

        contacts[index] = { ...contacts[index], ...updatedFields };
        localStorage.setItem('lp_contacts', JSON.stringify(contacts));
        return { success: true, data: contacts[index] };
      }
    },

    delete: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/contacts/${id}`, { method: 'DELETE' });
      } else {
        await delay();
        const contacts = JSON.parse(localStorage.getItem('lp_contacts'));
        const newContacts = contacts.filter(c => c._id !== id);
        localStorage.setItem('lp_contacts', JSON.stringify(newContacts));
        return { success: true, message: 'Contact deleted' };
      }
    },

    verify: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/contacts/${id}/verify`, { method: 'PUT' });
      } else {
        await delay();
        const contacts = JSON.parse(localStorage.getItem('lp_contacts'));
        const index = contacts.findIndex(c => c._id === id);
        if (index === -1) throw new Error('Contact not found');

        contacts[index].isVerified = true;
        localStorage.setItem('lp_contacts', JSON.stringify(contacts));

        // Alert notifications
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: contacts[index].owner,
          title: 'Contact Verified',
          message: `${contacts[index].name} has successfully verified their emergency credentials.`,
          type: 'security',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        return { success: true, data: contacts[index] };
      }
    }
  },

  // Reminders Endpoints
  reminders: {
    getAll: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/reminders');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const reminders = JSON.parse(localStorage.getItem('lp_reminders'));
        const items = reminders.filter(r => r.owner === userId);
        return { success: true, count: items.length, data: items };
      }
    },

    create: async (title, category, dueDate, notes) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/reminders', {
          method: 'POST',
          body: JSON.stringify({ title, category, dueDate, notes })
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';

        // Limit Check for Free Plan
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const currentUser = users.find(u => u._id === userId) || { subscriptionPlan: 'Free' };
        const reminders = JSON.parse(localStorage.getItem('lp_reminders'));
        const myReminders = reminders.filter(r => r.owner === userId);

        if (currentUser.subscriptionPlan === 'Free' && myReminders.length >= 3) {
          throw new Error('Free Plan limit reached (Max 3 reminders). Please upgrade to Premium.');
        }

        const newReminder = {
          _id: 'rem_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title,
          category,
          dueDate: new Date(dueDate).toISOString(),
          notes,
          completed: false,
          createdAt: new Date().toISOString()
        };

        reminders.push(newReminder);
        localStorage.setItem('lp_reminders', JSON.stringify(reminders));
        return { success: true, data: newReminder };
      }
    },

    update: async (id, updatedFields) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/reminders/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedFields)
        });
      } else {
        await delay();
        const reminders = JSON.parse(localStorage.getItem('lp_reminders'));
        const index = reminders.findIndex(r => r._id === id);
        if (index === -1) throw new Error('Reminder not found');

        reminders[index] = { ...reminders[index], ...updatedFields };
        localStorage.setItem('lp_reminders', JSON.stringify(reminders));

        if (updatedFields.completed) {
          const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
          notifications.unshift({
            _id: 'n_' + Math.random().toString(36).substring(2, 9),
            owner: reminders[index].owner,
            title: 'Tracker Completed',
            message: `You marked "${reminders[index].title}" as resolved.`,
            type: 'info',
            isRead: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('lp_notifications', JSON.stringify(notifications));
        }

        return { success: true, data: reminders[index] };
      }
    },

    delete: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/reminders/${id}`, { method: 'DELETE' });
      } else {
        await delay();
        const reminders = JSON.parse(localStorage.getItem('lp_reminders'));
        const newReminders = reminders.filter(r => r._id !== id);
        localStorage.setItem('lp_reminders', JSON.stringify(newReminders));
        return { success: true, message: 'Reminder deleted' };
      }
    }
  },

  // Emergency Setting Endpoints
  emergency: {
    getSettings: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/emergency/settings');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        let settings = emergency[userId];
        if (!settings) {
          settings = {
            owner: userId,
            inactivityDays: 30,
            automaticTriggerEnabled: false,
            emergencyNote: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.',
            status: 'Inactive',
            countdownStart: null
          };
          emergency[userId] = settings;
          localStorage.setItem('lp_emergency', JSON.stringify(emergency));
        }
        return { success: true, data: settings };
      }
    },

    updateSettings: async (settingsData) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/emergency/settings', {
          method: 'PUT',
          body: JSON.stringify(settingsData)
        });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';

        // Gate Premium for Automatic Trigger
        const users = JSON.parse(localStorage.getItem('lp_users'));
        const currentUser = users.find(u => u._id === userId) || { subscriptionPlan: 'Free' };
        if (settingsData.automaticTriggerEnabled === true && currentUser.subscriptionPlan === 'Free') {
          throw new Error('Inactivity automation is a Premium feature. Please upgrade your plan.');
        }

        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        emergency[userId] = {
          ...emergency[userId],
          ...settingsData,
          lastActiveDate: new Date().toISOString()
        };
        localStorage.setItem('lp_emergency', JSON.stringify(emergency));

        // Notification
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'Emergency Parameters Modified',
          message: 'Your legacy trigger conditions have been saved.',
          type: 'security',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        return { success: true, data: emergency[userId] };
      }
    },

    triggerCountdown: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/emergency/trigger-countdown', { method: 'POST' });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        emergency[userId].status = 'Countdown';
        emergency[userId].countdownStart = new Date().toISOString();
        localStorage.setItem('lp_emergency', JSON.stringify(emergency));

        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'Emergency Countdown Triggered',
          message: 'Inactivity limits hit. Legacy countdown initiated.',
          type: 'emergency',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        return { success: true, data: emergency[userId] };
      }
    },

    triggerSOS: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/emergency/trigger-sos', { method: 'POST' });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        emergency[userId].status = 'Triggered';
        emergency[userId].countdownStart = null;
        localStorage.setItem('lp_emergency', JSON.stringify(emergency));

        // Alert notifications
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'EMERGENCY PROTOCOL ACTIVATED',
          message: 'SOS trigger set. Trusted contacts have been dispatched notifications with decryption keys.',
          type: 'emergency',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        return { success: true, data: emergency[userId] };
      }
    },

    cancelSOS: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/emergency/cancel', { method: 'POST' });
      } else {
        await delay();
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const emergency = JSON.parse(localStorage.getItem('lp_emergency'));
        emergency[userId].status = 'Inactive';
        emergency[userId].countdownStart = null;
        localStorage.setItem('lp_emergency', JSON.stringify(emergency));

        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.unshift({
          _id: 'n_' + Math.random().toString(36).substring(2, 9),
          owner: userId,
          title: 'SOS Reset Successful',
          message: 'Welcome back. Emergency countdown cancelled. Active status cleared.',
          type: 'security',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));

        return { success: true, data: emergency[userId] };
      }
    }
  },

  // Notification Endpoints
  notifications: {
    getAll: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/notifications');
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        const items = notifications.filter(n => n.owner === userId);
        return { success: true, count: items.length, data: items };
      }
    },

    markRead: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/notifications/${id}/read`, { method: 'PUT' });
      } else {
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        const index = notifications.findIndex(n => n._id === id);
        if (index !== -1) {
          notifications[index].isRead = true;
          localStorage.setItem('lp_notifications', JSON.stringify(notifications));
        }
        return { success: true };
      }
    },

    markAllRead: async () => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request('/notifications/read-all', { method: 'PUT' });
      } else {
        const token = localStorage.getItem('lp_token');
        const userId = token ? token.replace('mock_token_', '') : 'user1';
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        notifications.forEach(n => {
          if (n.owner === userId) n.isRead = true;
        });
        localStorage.setItem('lp_notifications', JSON.stringify(notifications));
        return { success: true };
      }
    },

    delete: async (id) => {
      const isLive = await checkBackendConnection();
      if (isLive) {
        return request(`/notifications/${id}`, { method: 'DELETE' });
      } else {
        const notifications = JSON.parse(localStorage.getItem('lp_notifications'));
        const newNotifications = notifications.filter(n => n._id !== id);
        localStorage.setItem('lp_notifications', JSON.stringify(newNotifications));
        return { success: true };
      }
    }
  }
};
export default api;
