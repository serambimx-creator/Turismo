import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://golygzojriwynakbpuwn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbHlnem9qcml3eW5ha2JwdXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODEwODYsImV4cCI6MjA5MDY1NzA4Nn0.SJykIfZ7dZ6h9uJl5eZPgph_C90b8dkvYLlbu8XmMko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('URL:', supabaseUrl);
  const { data, error } = await supabase.from('asistentes').select('*');
  console.log('Data:', data);
  if (error) console.error('Error:', error);
}

main();
