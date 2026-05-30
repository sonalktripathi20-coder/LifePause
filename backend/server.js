const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Route files
const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const documentRoutes = require('./routes/documentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load environment variables
dotenv.config();

const app = reportAppInit();

function reportAppInit() {
  const expressApp = express();
  
  // Middleware
  expressApp.use(cors());
  expressApp.use(express.json());

  // Mount routers
  expressApp.use('/api/auth', authRoutes);
  expressApp.use('/api/vault', vaultRoutes);
  expressApp.use('/api/documents', documentRoutes);
  expressApp.use('/api/contacts', contactRoutes);
  expressApp.use('/api/reminders', reminderRoutes);
  expressApp.use('/api/emergency', emergencyRoutes);
  expressApp.use('/api/notifications', notificationRoutes);

  // Simple diagnostic route
  expressApp.get('/', (req, res) => {
    const supabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
    res.json({
      message: 'Welcome to the LifePause Supabase API.',
      status: supabaseConfigured ? 'online' : 'database_configuration_missing',
      timestamp: new Date()
    });
  });

  // Error handling middleware (catch-all)
  expressApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  });

  return expressApp;
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
