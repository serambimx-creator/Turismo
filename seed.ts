import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // 1. Validar a Luis
  const { data: luisData, error: luisError } = await supabase
    .from('asistentes')
    .upsert({
      nombre_completo: 'Luis',
      whatsapp: '7713300261',
      ciudad_salida: 'Pachuca',
      hospedaje: 'Cabaña',
      passcode: '0261',
      acceso_validado: true
    }, { onConflict: 'whatsapp' })
    .select();

  if (luisError) {
    console.error('Error validando a Luis:', luisError);
  } else {
    console.log('Luis validado:', luisData);
  }

  // 2. Crear cliente de prueba
  const { data: testData, error: testError } = await supabase
    .from('asistentes')
    .upsert({
      nombre_completo: 'Explorador de Prueba',
      whatsapp: '5551234567',
      ciudad_salida: 'CDMX',
      hospedaje: 'Camping',
      passcode: '4567',
      acceso_validado: true
    }, { onConflict: 'whatsapp' })
    .select();

  if (testError) {
    console.error('Error creando cliente de prueba:', testError);
  } else {
    console.log('Cliente de prueba creado:', testData);
  }
}

main();
