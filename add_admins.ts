import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const admins = [
  { nombre_completo: 'Alexia', whatsapp: '7712428433', passcode: '8433', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Marcos', whatsapp: '7752360855', passcode: '0855', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'José Manuel', whatsapp: '7713577730', passcode: '7730', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Karla', whatsapp: '7717741409', passcode: '1409', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Octavio', whatsapp: '5531377309', passcode: '7309', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Victoria', whatsapp: '5546566223', passcode: '6223', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Wendy', whatsapp: '7717727556', passcode: '7556', acceso_validado: true, rol: 'admin' },
  { nombre_completo: 'Luis', whatsapp: '7713300261', passcode: '0261', acceso_validado: true, rol: 'admin' }
];

async function main() {
  console.log('Agregando administradores...');
  
  for (const admin of admins) {
    const { data, error } = await supabase
      .from('asistentes')
      .upsert({
        nombre_completo: admin.nombre_completo,
        whatsapp: admin.whatsapp,
        passcode: admin.passcode,
        acceso_validado: admin.acceso_validado,
        ciudad_salida: 'CDMX',
        hospedaje: 'Cabaña',
        estatus_pago: 'Liquidado'
      }, { onConflict: 'whatsapp' });
      
    if (error) {
      console.error(`Error agregando a ${admin.nombre_completo}:`, error.message);
    } else {
      console.log(`✅ ${admin.nombre_completo} agregado/actualizado correctamente.`);
    }
  }
  
  console.log('Proceso finalizado.');
}

main();
