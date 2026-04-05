import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kujisvscghqsqmngzoxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1amlzdnNjZ2hxc3FtbmZ6b3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzU0MjcxOSwiZXhwIjoyMDU5MTE4NzE5fQ.2oNwzm9K6dq9zxBFyS7g3c9C3tPy5G_YZvKgbk5cHO0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const admins = [
  { nombre_completo: 'Alexia',      whatsapp: '7712428433', passcode: '8433' },
  { nombre_completo: 'Marcos',      whatsapp: '7752360855', passcode: '0855' },
  { nombre_completo: 'José Manuel', whatsapp: '7713577730', passcode: '7730' },
  { nombre_completo: 'Karla',       whatsapp: '7717741409', passcode: '1409' },
  { nombre_completo: 'Octavio',     whatsapp: '5531377309', passcode: '7309' },
  { nombre_completo: 'Victoria',    whatsapp: '5546566223', passcode: '6223' },
  { nombre_completo: 'Wendy',       whatsapp: '7717227556', passcode: '7556' },
  { nombre_completo: 'Luis',        whatsapp: '7713300261', passcode: '0261' },
];

async function seedAdmins() {
  console.log('🔧 Iniciando inserción/actualización de administradores...\n');

  for (const admin of admins) {
    // Verificar si el usuario ya existe
    const { data: existing } = await supabase
      .from('asistentes')
      .select('id, nombre_completo, es_admin, acceso_validado')
      .eq('whatsapp', admin.whatsapp)
      .maybeSingle();

    if (existing) {
      // Actualizar el registro existente
      const { error } = await supabase
        .from('asistentes')
        .update({
          nombre_completo: admin.nombre_completo,
          passcode: admin.passcode,
          es_admin: true,
          acceso_validado: true,
        })
        .eq('whatsapp', admin.whatsapp);

      if (error) {
        console.error(`❌ Error actualizando ${admin.nombre_completo}:`, error.message);
      } else {
        console.log(`✅ Actualizado: ${admin.nombre_completo} (${admin.whatsapp})`);
      }
    } else {
      // Insertar nuevo registro
      const { error } = await supabase
        .from('asistentes')
        .insert([{
          nombre_completo: admin.nombre_completo,
          whatsapp: admin.whatsapp,
          passcode: admin.passcode,
          es_admin: true,
          acceso_validado: true,
          ciudad_salida: 'Admin',
          email: '',
          telefono_emergencia: '',
          contacto_emergencia: '',
          tipo_hospedaje: 'admin',
          monto_pagado: 0,
        }]);

      if (error) {
        console.error(`❌ Error insertando ${admin.nombre_completo}:`, error.message);
      } else {
        console.log(`🆕 Creado: ${admin.nombre_completo} (${admin.whatsapp})`);
      }
    }
  }

  console.log('\n✨ Proceso terminado. Verifica el acceso en /explorador.');
}

seedAdmins();
