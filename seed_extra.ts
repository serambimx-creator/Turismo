import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // Insertar avisos
  const { error: avisosError } = await supabase
    .from('avisos_vivo')
    .insert([
      { mensaje: 'Recuerden llevar impermeable, hay probabilidad de lluvia ligera en la tarde.', urgencia: 'Media' },
      { mensaje: 'El punto de reunión ha cambiado ligeramente. Revisen la ubicación actualizada.', urgencia: 'Alta' }
    ]);

  if (avisosError) {
    console.error('Error insertando avisos:', avisosError);
  } else {
    console.log('Avisos insertados correctamente.');
  }

  // Insertar logistica
  const { error: logisticaError } = await supabase
    .from('logistica_viaje')
    .insert([
      { hora: '08:00 AM', actividad: 'Punto de Encuentro CDMX', enlace_maps_waze: 'https://maps.google.com' },
      { hora: '11:00 AM', actividad: 'Llegada a Cabañas', enlace_maps_waze: 'https://maps.google.com' },
      { hora: '12:30 PM', actividad: 'Inicio Ruta de Cascadas', enlace_maps_waze: 'https://maps.google.com' }
    ]);

  if (logisticaError) {
    console.error('Error insertando logistica:', logisticaError);
  } else {
    console.log('Logística insertada correctamente.');
  }
}

main();
