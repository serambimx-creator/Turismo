/**
 * SEED ADMINS
 * Script para asegurar que el equipo tenga acceso al portal.
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kujisvscghqsqmngzoxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1amlzdnNjZ2hxc3FtbmZ6b3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzU0MjcxOSwiZXhwIjoyMDU5MTE4NzE5fQ.2oNwzm9K6dq9zxBFyS7g3c9C3tPy5G_YZvKgbk5cHO0';

const admins = [
  { nombre_completo: 'Alexia', whatsapp: '7712428433', passcode: '8433' },
  { nombre_completo: 'Marcos', whatsapp: '7752360855', passcode: '0855' },
  { nombre_completo: 'José Manuel', whatsapp: '7713577730', passcode: '7730' },
  { nombre_completo: 'Karla', whatsapp: '7717741409', passcode: '1409' },
  { nombre_completo: 'Octavio', whatsapp: '5531377309', passcode: '7309' },
  { nombre_completo: 'Victoria', whatsapp: '5546566223', passcode: '6223' },
  { nombre_completo: 'Wendy', whatsapp: '7717227556', passcode: '7556' },
  { nombre_completo: 'Luis', whatsapp: '7713300261', passcode: '0261' },
];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log('--- Iniciando Alta de Administradores ---');
  for (const admin of admins) {
    const { data: existing } = await supabase
      .from('asistentes')
      .select('whatsapp')
      .eq('whatsapp', admin.whatsapp)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('asistentes')
        .update({
          nombre_completo: admin.nombre_completo,
          passcode: admin.passcode,
          es_admin: true,
          acceso_validado: true
        })
        .eq('whatsapp', admin.whatsapp);
      
      if (error) console.error('Error actualizando:', admin.nombre_completo, error);
      else console.log('Actualizado:', admin.nombre_completo);
    } else {
      const { error } = await supabase
        .from('asistentes')
        .insert([{
          ...admin,
          es_admin: true,
          acceso_validado: true,
          ciudad_salida: 'Admin',
          email: 'admin@serambi.mx',
          monto_pagado: 0
        }]);
      
      if (error) console.error('Error insertando:', admin.nombre_completo, error);
      else console.log('Insertado:', admin.nombre_completo);
    }
  }
}

run();
