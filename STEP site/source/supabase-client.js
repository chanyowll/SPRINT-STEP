/* =====================================================================
   STEP Hub — Supabase Client
   Initializes the Supabase JS client and provides auth + data helpers.

   SETUP: Replace the URL and ANON_KEY below with your Supabase project
   credentials (Dashboard → Settings → API).
   ===================================================================== */

(function () {
  'use strict';

  // ── Supabase credentials ──────────────────────────────────────────
  // TODO: Replace these with your actual Supabase project values
  const SUPABASE_URL  = 'https://roarebrfugxwdabduebt.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYXJlYnJmdWd4d2RhYmR1ZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMzA1MjksImV4cCI6MjEwNTcwNjUyOX0.DukLVOdBHDopVw08Ae9ZMJqD1YBHaUUTGfDP7aNt-j0';

  // ── Initialize client ─────────────────────────────────────────────
  let _supabase = null;

  function getClient() {
    if (_supabase) return _supabase;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('[STEP] Supabase JS library not loaded. Running in offline/mock mode.');
      return null;
    }
    if (SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      console.warn('[STEP] Supabase credentials not configured. Running in offline/mock mode.');
      return null;
    }
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return _supabase;
  }

  // ── Auth helpers ──────────────────────────────────────────────────

  /** Sign in with email + password */
  async function signIn(email, password) {
    const sb = getClient();
    if (!sb) return { error: { message: 'Supabase not configured' } };
    console.log('[STEP/SB] Calling signInWithPassword for:', email);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    console.log('[STEP/SB] signInWithPassword result:', error ? 'ERROR: ' + error.message : 'OK, user: ' + (data?.user?.id || 'none'));
    if (!error && data.user) {
      try {
        const profile = await fetchProfile(data.user.id);
        window.dispatchEvent(new CustomEvent('stephub_auth_changed', { detail: { user: profile } }));
      } catch (profileErr) {
        console.warn('[STEP/SB] Profile fetch in signIn failed:', profileErr);
      }
    }
    return { data, error };
  }

  /** Sign up with email + password */
  async function signUp(email, password, fullName) {
    const sb = getClient();
    if (!sb) return { error: { message: 'Supabase not configured' } };
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '' } }
    });
    return { data, error };
  }

  /** Sign out */
  async function signOut() {
    const sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
    window.dispatchEvent(new CustomEvent('stephub_auth_changed', { detail: { user: null } }));
  }

  /** Sign in with Google OAuth */
  async function signInWithGoogle() {
    const sb = getClient();
    if (!sb) return { error: { message: 'Supabase not configured' } };
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    return { data, error };
  }

  /** Fetch the profile row for a user (role, team, etc.) */
  async function fetchProfile(userId) {
    const sb = getClient();
    if (!sb) return null;

    // Try RPC first (bypasses RLS via SECURITY DEFINER)
    try {
      const { data: rpcData, error: rpcError } = await sb.rpc('get_my_profile');
      if (!rpcError && rpcData) {
        console.log('[STEP] Profile via RPC:', rpcData);
        return rpcData;
      }
      if (rpcError) console.warn('[STEP] RPC get_my_profile error:', rpcError);
    } catch (e) {
      console.warn('[STEP] RPC call failed:', e);
    }

    // Fallback to direct query
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) { console.error('[STEP] Profile fetch error:', error); return null; }
    return data;
  }

  /** Get the currently signed-in user + their profile */
  async function getCurrentUser() {
    const sb = getClient();
    if (!sb) return null;
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const profile = await fetchProfile(user.id);
    return profile;
  }

  /** Get the current session synchronously (cached) */
  function getSession() {
    const sb = getClient();
    if (!sb) return null;
    return sb.auth.getSession();
  }

  /** Listen for auth state changes */
  function onAuthChange(callback) {
    const sb = getClient();
    if (!sb) return { data: { subscription: { unsubscribe: () => {} } } };
    return sb.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        callback(event, profile);
      } else {
        callback(event, null);
      }
    });
  }

  // ── Data helpers ──────────────────────────────────────────────────

  /** Check if Supabase is configured and available */
  function isOnline() {
    return !!getClient();
  }

  /** Generic query helper */
  async function query(table, options) {
    const sb = getClient();
    if (!sb) return { data: null, error: { message: 'Offline' } };
    let q = sb.from(table).select(options.select || '*');
    if (options.eq) {
      for (const [col, val] of Object.entries(options.eq)) {
        q = q.eq(col, val);
      }
    }
    if (options.order) q = q.order(options.order.column, { ascending: options.order.ascending !== false });
    if (options.limit) q = q.limit(options.limit);
    return await q;
  }

  // ── Expose globally ───────────────────────────────────────────────
  window.STEP_SUPABASE = {
    getClient,
    isOnline,
    // Auth
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    getCurrentUser,
    getSession,
    onAuthChange,
    fetchProfile,
    // Data
    query,
  };

  // ── Auto-init: listen for auth changes and dispatch stephub_auth_changed ──
  if (getClient()) {
    onAuthChange(async (event, profile) => {
      window.dispatchEvent(new CustomEvent('stephub_auth_changed', { detail: { user: profile } }));
    });

    // Check for existing session on page load
    getCurrentUser().then(profile => {
      if (profile) {
        window.dispatchEvent(new CustomEvent('stephub_auth_changed', { detail: { user: profile } }));
      }
    });
  }

})();
