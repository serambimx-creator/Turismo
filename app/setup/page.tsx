'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Shield, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const [rawDiagnostic, setRawDiagnostic] = useState<string>('');

  const runDiagnostic = async () => {
    setRawDiagnostic('Iniciando diagnóstico...\n');
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setRawDiagnostic(prev => prev + `URL configurada: ${url}\n`);
      setRawDiagnostic(prev => prev + `Key configurada (inicio): ${key?.substring(0, 10)}...\n`);
      
      if (!url || !key) {
        setRawDiagnostic(prev => prev + '❌ ERROR: Faltan llaves en .env.local\n');
        return;
      }

      setRawDiagnostic(prev => prev + 'Haciendo ping a Supabase...\n');
      
      // Test 1: Fetch directo a la URL REST
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      setRawDiagnostic(prev => prev + `Status HTTP: ${response.status}\n`);
      
      if (!response.ok) {
        const errorText = await response.text();
        setRawDiagnostic(prev => prev + `❌ ERROR HTTP: ${errorText}\n`);
      } else {
        setRawDiagnostic(prev => prev + '✅ Conexión HTTP exitosa.\n');
      }

      // Test 2: Intentar leer la tabla
      setRawDiagnostic(prev => prev + 'Intentando leer tabla "asistentes"...\n');
      const tableResponse = await fetch(`${url}/rest/v1/asistentes?select=count`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });

      if (!tableResponse.ok) {
        const errorText = await tableResponse.text();
        setRawDiagnostic(prev => prev + `❌ ERROR TABLA: ${errorText}\n`);
      } else {
        setRawDiagnostic(prev => prev + '✅ Tabla "asistentes" encontrada.\n');
      }

    } catch (err: any) {
      setRawDiagnostic(prev => prev + `❌ ERROR CATASTRÓFICO: ${err.message}\n`);
    }
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      localStorage.setItem('SB_URL', url);
      localStorage.setItem('SB_KEY', key);
      
      setStatus('success');
      setMessage('Configuración guardada. Ahora puedes inicializar la base de datos o ir al login.');
    } catch (err) {
      setStatus('error');
      setMessage('Error al guardar la configuración.');
    }
  };

  const handleSeed = async () => {
    setStatus('loading');
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('asistentes').upsert({
        nombre_completo: 'Luis',
        whatsapp: '7713300261',
        ciudad_salida: 'Pachuca',
        hospedaje: 'Cabaña',
        passcode: '0261',
        acceso_validado: true
      }, { onConflict: 'whatsapp' });
      
      if (error) throw error;
      
      setStatus('success');
      setMessage('Usuario de prueba creado exitosamente. Ya puedes iniciar sesión.');
    } catch (err: any) {
      setStatus('error');
      setMessage('Error al crear usuario: ' + (err.message || 'Desconocido. ¿Ya corriste el script SQL en Supabase?'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Configuración de Emergencia</h1>
          <p className="text-slate-500 text-sm">
            Si no encuentras el panel de Secrets, pega tus llaves aquí para activar la base de datos.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supabase URL</label>
            <input 
              type="text" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="https://xyz.supabase.co"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supabase Anon Key</label>
            <input 
              type="password" 
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="eyJhbG..."
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="flex-1 bg-blue-600 text-white font-bold rounded-xl py-3 hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar</>}
            </button>
            
            <button 
              type="button"
              onClick={handleSeed}
              disabled={status === 'loading'}
              className="flex-1 bg-emerald-600 text-white font-bold rounded-xl py-3 hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 text-sm"
            >
              Crear Usuario de Prueba
            </button>
          </div>
          
          <button 
            type="button"
            onClick={() => router.push('/explorador')}
            className="w-full bg-slate-100 text-slate-700 font-bold rounded-xl py-3 hover:bg-slate-200 transition-all flex justify-center items-center gap-2 mt-2"
          >
            Ir al Login
          </button>

          {status === 'success' && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5" />
              <p>{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5" />
              <p>{message}</p>
            </div>
          )}
        </form>
        <div className="mt-8 border-t border-slate-100 pt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Herramienta de Diagnóstico</h2>
          <p className="text-sm text-slate-500 mb-4">
            Si la conexión sigue fallando, usa este botón para ver exactamente qué está respondiendo Supabase.
          </p>
          <button
            onClick={runDiagnostic}
            type="button"
            className="w-full bg-slate-800 text-white font-semibold rounded-xl py-3 hover:bg-slate-900 transition-colors mb-4"
          >
            Ejecutar Diagnóstico Profundo
          </button>
          
          {rawDiagnostic && (
            <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-mono">
              {rawDiagnostic}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
