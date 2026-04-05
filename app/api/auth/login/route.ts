import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { whatsapp, passcode, supabaseUrl, supabaseKey } = await request.json();

    if (!whatsapp || !passcode) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
      return NextResponse.json({ error: 'Falta configuración de base de datos válida' }, { status: 400 });
    }

    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e: any) {
      return NextResponse.json({ error: 'URL de base de datos no válida' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('asistentes')
      .select('*')
      .eq('whatsapp', whatsapp)
      .eq('passcode', passcode)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Errores de credenciales suelen ser 401
      return NextResponse.json({ error: 'WhatsApp o Clave incorrectos' }, { status: 401 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (error: any) {
    console.error('Server error:', error);
    const msg = error.message || 'Error interno del servidor';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
