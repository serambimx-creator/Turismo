const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kujisvscghqsqmngzoxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1amlzdnNjZ2hxc3FtbmZ6b3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzU0MjcxOSwiZXhwIjoyMDU5MTE4NzE5fQ.2oNwzm9K6dq9zxBFyS7g3c9C3tPy5G_YZvKgbk5cHO0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log('--- TABLA ASISTENTES ---');
  const { data: asis, error: err1 } = await supabase.from('asistentes').select('id, nombre_completo, whatsapp, passcode, es_admin, acceso_validado');
  if (err1) console.error(err1);
  else console.table(asis);

  console.log('\n--- TABLA ADMINISTRADORES ---');
  const { data: adm, error: err2 } = await supabase.from('administradores').select('*');
  if (err2) console.error(err2);
  else console.table(adm);
}

check();
