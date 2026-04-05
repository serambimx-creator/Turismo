import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Configuración faltante' }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const results = [];
  for (const admin of admins) {
    const { data: existing } = await supabase
      .from('asistentes')
      .select('id')
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
      results.push({ name: admin.nombre_completo, status: error ? 'error' : 'actualizado' });
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
      results.push({ name: admin.nombre_completo, status: error ? 'error' : 'creado' });
    }
  }

  return NextResponse.json({ message: 'Proceso de activación completado', details: results });
}
