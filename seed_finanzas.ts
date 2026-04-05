import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("Insertando valores de base para configuracion financiera...");
  
  const { data, error } = await supabase
    .from('configuracion_finanzas')
    .insert([{
        renta_van: 6510,
        rendimiento_km_l: 7.5,
        factor_terreno: 1.15,
        precio_gasolina: 23.99,
        distancia_estimada: 360,
        comida_llegada: 130,
        comida_regreso: 130,
        entrada_turista: 250,
        entrada_staff: 150,
        camping: 120,
        cabana_3: 1000,
        cabana_4: 1500,
        cabana_6: 1800,
        foto_dron: 500,
        materiales: 450,
        modificadores: 1.20,
        organizadores: 5
    }])
    .select();

  if (error) {
    console.error('Error insertando parametros financieros:', error);
  } else {
    console.log('Configuracion financiera inicializada correctamente:', data);
  }
}

main();
