const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('WARNING: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables!');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Creates a Supabase client configured with the user's JWT token.
 * This automatically propagates the user identity to PostgreSQL,
 * ensuring all Row Level Security (RLS) policies are correctly enforced.
 */
const getClientForUser = (token) => {
  if (!token || token === 'undefined') return supabase;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

module.exports = { supabase, getClientForUser };
