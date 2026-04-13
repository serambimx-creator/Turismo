import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { whatsapp, passcode } = await request.json();

    if (!whatsapp || !passcode) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    // Verificamos si las llaves están configuradas en el servidor
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('missing-url')) {
      return NextResponse.json({ 
        error: 'El servidor no tiene configurada la base de datos (Variables de entorno faltantes en Vercel).' 
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('asistentes')
      .select('*')
      .eq('whatsapp', whatsapp)
      .eq('passcode', passcode)
      .single();

    if (error) {
      console.error('Supabase error:', error);
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
