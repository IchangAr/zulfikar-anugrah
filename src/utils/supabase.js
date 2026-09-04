import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gaygkakcyrhqbcmyyvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheWdrYWtjeXJocWJjbXl5dmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNzkzNjUsImV4cCI6MjA5OTg1NTM2NX0.oF2me71uis5UHD1UMFhKk6MZrpZV0YHxPq6KsP5YPZ4';

export const supabase = createClient(supabaseUrl, supabaseKey);
