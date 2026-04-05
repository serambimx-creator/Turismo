'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { Leaf, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ExploradorLogin() {
  const [whatsapp, setWhatsapp] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionWp = localStorage.getItem('session_whatsapp');
    const sessionRol = localStorage.getItem('session_rol');
    if (sessionWp && sessionRol === 'admin') {
       router.push('/admin');
    } else if (sessionWp) {
       router.push(`/explorador/${sessionWp}`);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado. WhatsApp:', whatsapp, 'Passcode length:', passcode.length);
    setLoading(true);
    setError('');
    setWarning('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let isTimeout = false;
    // Timeout de seguridad de 30 segundos
    const loginTimeout = setTimeout(() => {
      isTimeout = true;
      setLoading(false);
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('SB_URL') || 'ninguna';
      setError(`Tiempo de espera agotado conectando a: ${url}. Verifica tu conexión a internet o si hay bloqueadores de anuncios.`);
    }, 30000);

    try {
      console.log('Intentando login para:', whatsapp);
      
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('SB_URL') || '';
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem('SB_KEY') || '';

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsapp,
          passcode,
          supabaseUrl: url,
          supabaseKey: key
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(loginTimeout);
      if (isTimeout) return;

      const result = await response.json();

      if (!response.ok) {
        console.error('Error de API:', result.error);
        setError(`Error: ${result.error}`);
        setLoading(false);
        return;
      }

      const data = result.user;

      console.log('Usuario encontrado:', data.nombre_completo);

      if (!data.acceso_validado) {
        setWarning('Tu lugar está reservado, pero tu acceso aún está pendiente de validación por el equipo.');
        setLoading(false);
        return;
      }

      console.log('Guardando sesión...');
      localStorage.setItem('session_whatsapp', data.whatsapp);
      
      if (data.es_admin) {
        localStorage.setItem('session_rol', 'admin');
        router.push('/admin');
      } else {
        localStorage.setItem('session_rol', 'turista');
        router.push(`/explorador/${whatsapp}`);
      }
    } catch (err) {
      clearTimeout(loginTimeout);
      console.error('Error inesperado:', err);
      setError('Error al conectar con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* Logo */}
      <div className="mb-8">
        <Image 
          src="/serambi logo(1).png" 
          alt="SERAMBI Logo" 
          width={150} 
          height={50} 
          className="object-contain h-12 w-auto"
          priority
        />
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        {typeof window !== 'undefined' && !localStorage.getItem('SB_URL') && !process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-mono">
            ⚠️ ATENCIÓN: No se han detectado llaves de Supabase. Por favor ve a la página de /setup para configurarlas.
          </div>
        )}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Acceso al Portal del Explorador</h1>
          <p className="text-slate-500 text-sm">
            Ingresa con tu número de WhatsApp y los últimos 4 dígitos del mismo como clave.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {warning && (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{warning}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número de WhatsApp</label>
            <input 
              type="tel" 
              required
              value={whatsapp}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                // Si pegan con código de país (ej. 52), tomamos los últimos 10 dígitos
                if (digits.length > 10 && digits.startsWith('52')) {
                  setWhatsapp(digits.slice(-10));
                } else {
                  setWhatsapp(digits.slice(0, 10));
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              placeholder="10 dígitos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Clave de Acceso</label>
            <input 
              type="password" 
              required
              maxLength={4}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono tracking-widest"
              placeholder="••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || whatsapp.length < 10 || passcode.length < 4}
            className="w-full bg-emerald-600 text-white font-bold rounded-xl py-4 hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cargando...</span>
              </>
            ) : (
              <>
                <span>Entrar al Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {(whatsapp.length > 0 && whatsapp.length < 10) && (
            <p className="text-[10px] text-slate-400 text-center mt-2 italic">Faltan {10 - whatsapp.length} dígitos en el WhatsApp</p>
          )}
          {(whatsapp.length === 10 && passcode.length > 0 && passcode.length < 4) && (
            <p className="text-[10px] text-slate-400 text-center mt-2 italic">Faltan {4 - passcode.length} dígitos en la clave</p>
          )}
        </form>
      </div>
      
      {/* Back to home & Debug */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2 opacity-50">Depuración de Sistema</p>
            <div className="flex gap-4">
                <button 
                onClick={async () => {
                    setLoading(true);
                    setError('');
                    setWarning('');
                    try {
                    const supabase = getSupabase();
                    const { data, error } = await supabase.from('asistentes').select('count', { count: 'exact', head: true });
                    if (error) throw error;
                    setWarning(`✅ Conexión Exitosa. Total registros: ${data || 0}`);
                    } catch (err: any) {
                    setError(`❌ Error: ${err.message || 'Sin respuesta.'}`);
                    } finally {
                    setLoading(false);
                    }
                }}
                className="bg-white/10 hover:bg-white/20 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black transition-all"
                >
                Test Conexión
                </button>
                <button 
                onClick={() => {
                    localStorage.removeItem('SB_URL');
                    localStorage.removeItem('SB_KEY');
                    localStorage.removeItem('session_whatsapp');
                    localStorage.removeItem('session_rol');
                    window.location.reload();
                }}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black transition-all"
                >
                Limpiar Caché
                </button>
            </div>
            <p className="mt-4 text-[9px] text-slate-400 font-mono italic">
                URL Activa: {typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('SB_URL') || 'No configurada') : 'Cargando...'}
            </p>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="text-slate-500 hover:text-emerald-600 text-sm font-black uppercase tracking-widest transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
