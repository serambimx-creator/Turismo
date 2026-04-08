import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  console.log('--- Current Tables Check ---');
  
  const tables = ['administradores', 'asistentes', 'configuracion_finanzas', 'cabanas_inventario'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table "${table}": ${error.message} (${error.code})`);
    } else {
      console.log(`✅ Table "${table}": Accessible. Records found: ${data?.length || 0}`);
      if (data && data.length > 0) {
        console.log(`   Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`);
      }
    }
  }
}

check();
