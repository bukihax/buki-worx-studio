// ── Supabase Client ───────────────────────────────────────────────────────────
// Supabase is a Backend-as-a-Service (BaaS) platform built on PostgreSQL.
// The CDN script (loaded before this file) adds `supabase` to window.
// createClient() opens a persistent connection using our project credentials.

var SUPABASE_URL  = 'https://oriqdpbbjjcnzntzvijp.supabase.co';
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaXFkcGJiampjbnpudHp2aWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MzQ2MjQsImV4cCI6MjA5MjMxMDYyNH0.nkiTl4q0sNtsKi9yicNKvl2bVxkhl4ZdJS88gQBClwo';

// supabaseClient is the single connection object used by auth.js and script.js.
// All database queries and auth calls go through this one instance.
var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
