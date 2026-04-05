'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Users, Bell, Map, Check, X, Loader2, DollarSign, TrendingUp, PieChart, Trash2, Save, Settings, Truck, Home, Wrench, Compass, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('asistentes');
  const [asistentes, setAsistentes] = useState<any[]>([]);
  const [cabanas, setCabanas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClientToast, setNewClientToast] = useState<{nombre: string} | null>(null);

  // Avisos form state
  const [avisoMensaje, setAvisoMensaje] = useState('');
  const [avisoUrgencia, setAvisoUrgencia] = useState('Media');
  const [avisoSubmitting, setAvisoSubmitting] = useState(false);

  // Logistica form state
  const [logistica, setLogistica] = useState<any[]>([]);
  const [logisticaHora, setLogisticaHora] = useState('');
  const [logisticaActividad, setLogisticaActividad] = useState('');
  const [logisticaLink, setLogisticaLink] = useState('');
  const [logisticaSubmitting, setLogisticaSubmitting] = useState(false);

  const [finanzas, setFinanzas] = useState<Record<string, any>>({
    id: '', renta_van: 6510, rendimiento_km_l: 7.5, factor_terreno: 1.15,
    precio_gasolina: 23.99, distancia_estimada: 360, comida_llegada: 130, comida_regreso: 130,
    entrada_turista: 250, entrada_staff: 150, camping: 120, cabana_3: 1000,
    cabana_4: 1500, cabana_6: 1800, foto_dron: 500, materiales: 450,
    modificadores: 1.20, organizadores: 5
  });
  const [finanzasSubmitting, setFinanzasSubmitting] = useState(false);
  const [isEditingFinanzas, setIsEditingFinanzas] = useState(false);

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [provNombre, setProvNombre] = useState('');
  const [provServicio, setProvServicio] = useState('');
  const [provContacto, setProvContacto] = useState('');
  const [provSubmitting, setProvSubmitting] = useState(false);

  const fetchProveedores = async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('proveedores').select('*').order('created_at', { ascending: false });
    if (!error && data) setProveedores(data as any[]);
  };

  const handleProvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvSubmitting(true);
    const supabase = getSupabase();
    const { error } = await supabase.from('proveedores').insert([{
      nombre: provNombre,
      servicio: provServicio,
      contacto: provContacto
    }]);
    if (!error) {
      setProvNombre(''); setProvServicio(''); setProvContacto('');
      fetchProveedores();
      alert('Proveedor agregado');
    }
    setProvSubmitting(false);
  };

  const deleteProveedor = async (id: string) => {
    const supabase = getSupabase();
    await supabase.from('proveedores').delete().eq('id', id);
    setProveedores((prev: any[]) => prev.filter((p: any) => p.id !== id));
  };

  const fetchFinanzas = async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('configuracion_finanzas').select('*').limit(1).single();
    if (!error && data) setFinanzas(data);
  };

  const handleFinanzasUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFinanzasSubmitting(true);
    const supabase = getSupabase();
    let res;
    if (finanzas.id) {
       res = await supabase.from('configuracion_finanzas').update(finanzas).eq('id', finanzas.id);
    } else {
       const { id, ...fData } = finanzas;
       res = await supabase.from('configuracion_finanzas').insert([fData]);
    }
    setFinanzasSubmitting(false);
    setIsEditingFinanzas(false);
    if (!res.error) {
      alert('Configuración financiera guardada');
      fetchFinanzas();
    }
  };

  const deleteLogistica = async (id: string) => {
    const supabase = getSupabase();
    await supabase.from('logistica_viaje').delete().eq('id', id);
    setLogistica(logistica.filter(l => l.id !== id));
  };

  const fetchAsistentes = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data, error } = await supabase.from('asistentes').select('*').order('created_at', { ascending: false });
    if (!error && data) setAsistentes(data);
    setLoading(false);
  };

  const fetchLogistica = async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('logistica_viaje').select('*').order('hora', { ascending: true });
    if (!error && data) setLogistica(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_whatsapp');
    localStorage.removeItem('session_rol');
    router.push('/explorador');
  };

  useEffect(() => {
    const sessionRol = localStorage.getItem('session_rol');
    if (sessionRol !== 'admin') {
      router.push('/explorador');
      return;
    }

    const loadData = async () => {
      await fetchAsistentes();
      await fetchLogistica();
      await fetchFinanzas();
      await fetchProveedores();
      // Cargar inventario de cabañas
      const sb = getSupabase();
      const { data: cabs } = await sb.from('cabanas_inventario').select('*').eq('activa', true).order('tipo');
      if (cabs) setCabanas(cabs);
    };
    loadData();

    // ── Suscripción Realtime ──────────────────────────────────────────
    const supabase = getSupabase();
    const channel = supabase.channel('realtime_asistentes_admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'asistentes' }, (payload) => {
        if (!payload.new.es_admin) {
          setNewClientToast({ nombre: payload.new.nombre_completo });
          // Refrescar asistentes para que Acomodo también se actualice
          fetchAsistentes();
          setTimeout(() => setNewClientToast(null), 8000);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'asistentes' }, () => {
        // Actualizar tabla cuando se valida un pago o acceso
        fetchAsistentes();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleAcceso = async (id: string, currentStatus: boolean) => {
    const supabase = getSupabase();
    const { error } = await supabase.from('asistentes').update({ acceso_validado: !currentStatus }).eq('id', id);
    if (!error) {
      setAsistentes(asistentes.map(a => a.id === id ? { ...a, acceso_validado: !currentStatus } : a));
    }
  };

  const togglePago = async (id: string, currentStatus: string) => {
    const supabase = getSupabase();
    const newStatus = currentStatus === 'Liquidado' ? 'Pendiente' : 'Liquidado';
    const { error } = await supabase.from('asistentes').update({ estatus_pago: newStatus }).eq('id', id);
    if (!error) {
      setAsistentes(asistentes.map(a => a.id === id ? { ...a, estatus_pago: newStatus } : a));
    }
  };

  const handleAvisoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvisoSubmitting(true);
    const supabase = getSupabase();
    const { error } = await supabase.from('avisos_vivo').insert([{ mensaje: avisoMensaje, urgencia: avisoUrgencia }]);
    if (!error) {
      setAvisoMensaje('');
      alert('Aviso enviado');
    }
    setAvisoSubmitting(false);
  };

  const handleLogisticaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogisticaSubmitting(true);
    const supabase = getSupabase();
    const { error } = await supabase.from('logistica_viaje').insert([{ 
      hora: logisticaHora, 
      actividad: logisticaActividad, 
      enlace_maps_waze: logisticaLink 
    }]);
    if (!error) {
      setLogisticaHora('');
      setLogisticaActividad('');
      setLogisticaLink('');
      fetchLogistica();
      alert('Logística actualizada');
    }
    setLogisticaSubmitting(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Nombre', 'Es Admin', 'WhatsApp', 'Validado Acces', 'Pago', 'Total MXN', 'Hospedaje Tipo', 'Acompañantes Extras', 'Acompañantes Desc', 'Comida Incluida']
    ];
    asistentes.forEach(a => {
      const nombresAcomp = (a.acompanantes || []).map((ac: any) => `${ac.nombre}(${ac.edad})`).join(' | ');
      rows.push([
        a.nombre_completo,
        a.es_admin ? 'Si' : 'No',
        a.whatsapp,
        a.acceso_validado ? 'Si' : 'No',
        a.estatus_pago,
        a.costo_total || '0',
        `${a.opciones_viaje?.hospedaje || ''} ${a.opciones_viaje?.tipo_cabana || ''}`,
        a.acompanantes?.length || 0,
        nombresAcomp,
        a.opciones_viaje?.comida_incluida ? 'Si' : 'No'
      ]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SERAMBI_Asistentes_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-24">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/10 p-4 sticky top-0 z-20">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-[#39FF14] tracking-widest uppercase flex items-center">
            War Room 
            <span className="ml-2 text-[10px] bg-[#39FF14]/10 text-[#39FF14] px-2 py-1 rounded border border-[#39FF14]/30 hidden md:inline-block">ADMIN</span>
          </h1>
          <div className="flex gap-2">
            <button onClick={() => router.push('/')} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Ver Landing Page">
              <Home className="w-5 h-5" />
            </button>
            <button onClick={() => router.push('/explorador')} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Ver App Explorador">
              <Compass className="w-5 h-5" />
            </button>
            <button onClick={() => router.push('/setup')} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Configuración Sistema (Setup)">
              <Wrench className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors" title="Cerrar Sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Area */}
      {newClientToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2">
            <Bell className="w-5 h-5 animate-bounce" />
            <span>¡Nueva reserva de: {newClientToast.nombre}!</span>
            <button onClick={() => setNewClientToast(null)} className="ml-2 bg-black/20 hover:bg-black/40 rounded-full p-1"><X className="w-3 h-3 text-black" /></button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === 'asistentes' && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="mr-2 text-[#00f0ff]" /> Gestión de Asistentes
              </h2>
              <button onClick={handleExportCSV} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center">
                Exportar CSV
              </button>
            </div>
            
            {/* Analíticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Viajeros Totales</p>
                <p className="text-3xl font-black text-white">
                  {asistentes.filter(a => !a.es_admin).reduce((acc, curr) => acc + 1 + (curr.acompanantes?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ingresos Por Cobrar</p>
                <p className="text-3xl font-black text-amber-400">
                  ${asistentes.filter(a => !a.es_admin && a.estatus_pago === 'Pendiente').reduce((acc, curr) => acc + Number(curr.costo_total || 0), 0).toLocaleString('es-MX')}
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pagado (Liquidado)</p>
                <p className="text-3xl font-black text-emerald-400">
                  ${asistentes.filter(a => !a.es_admin && a.estatus_pago === 'Liquidado').reduce((acc, curr) => acc + Number(curr.costo_total || 0), 0).toLocaleString('es-MX')}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#39FF14]" /></div>
            ) : (
              <div className="space-y-6">
                
                <details className="group bg-[#0a0a0a] rounded-xl border border-emerald-500/30 overflow-hidden" open>
                  <summary className="cursor-pointer bg-emerald-500/10 p-4 font-bold text-emerald-400 flex justify-between items-center outline-none">
                    <span>🎒 Clientes y Pasajeros ({asistentes.filter(a => !a.es_admin).length})</span>
                    <span className="text-sm px-2 py-1 bg-emerald-500/20 rounded">Ver Lista</span>
                  </summary>
                  <div className="p-4 space-y-4">
                    {asistentes.filter(a => !a.es_admin).map((a) => {
                      const tieneAcomp = (a.acompanantes?.length || 0) > 0;
                      const cabanaInfo = a.opciones_viaje?.hospedaje === 'Cabaña'
                        ? cabanas.find(c => c.id === a.opciones_viaje?.cabana_id)
                        : null;
                      const buffetList = [
                        ...(a.opciones_viaje?.buffet_titular ? [a.nombre_completo] : []),
                        ...(a.acompanantes || []).filter((ac: any) => ac.buffet_extra).map((ac: any) => ac.nombre)
                      ];
                      return (
                      <div key={a.id} className={`bg-[#121212] rounded-xl border p-4 relative transition-all ${a.estatus_pago === 'Liquidado' ? 'border-emerald-500/20' : 'border-white/5'}`}>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                              {a.nombre_completo}
                              {a.acceso_validado && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">✓ Acceso activo</span>}
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">
                              📱 {a.whatsapp} · 🏙️ {a.ciudad_salida}
                              {a.opciones_viaje?.edad_titular ? ` · ${a.opciones_viaje.edad_titular} años` : ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-lg font-black text-emerald-400">${Number(a.costo_total || 0).toLocaleString('es-MX')}</p>
                            <p className="text-[10px] text-slate-600">total</p>
                          </div>
                        </div>

                        {/* Datos del hospedaje */}
                        <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5 text-xs space-y-1.5 mb-3">
                          <div className="flex items-start gap-2">
                            <span className="text-slate-500 shrink-0">🏠 Hospedaje:</span>
                            <span className="text-white font-medium">
                              {a.opciones_viaje?.hospedaje === 'Cabaña'
                                ? `${cabanaInfo ? cabanaInfo.nombre : a.opciones_viaje?.cabana_nombre || 'Cabaña'} (${a.opciones_viaje?.cabana_modo === 'privada' ? 'Privada completa' : `${a.opciones_viaje?.cabana_lugares_a_pagar || '?'} lugares compartidos`})`
                                : `Camping — ${a.opciones_viaje?.camping_equipo === 'renta' ? 'Renta de carpa' : 'Equipo propio'}`
                              }
                            </span>
                          </div>
                          {tieneAcomp && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 shrink-0">👥 Grupo:</span>
                              <span className="text-slate-300">{[a.nombre_completo, ...(a.acompanantes || []).map((ac: any) => `${ac.nombre}(${ac.edad}a)`)].join(' · ')}</span>
                            </div>
                          )}
                          {buffetList.length > 0 && (
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 shrink-0">🍽️ Buffet Tlalli:</span>
                              <span className="text-amber-400">{buffetList.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            {/* Toggle Acceso */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500">Acceso</span>
                              <button
                                onClick={() => toggleAcceso(a.id, a.acceso_validado)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${a.acceso_validado ? 'bg-[#39FF14]' : 'bg-gray-700'}`}
                              >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${a.acceso_validado ? 'translate-x-5' : 'translate-x-1'}`} />
                              </button>
                            </div>
                            {/* Toggle Pago */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500">Pago</span>
                              <button
                                onClick={() => togglePago(a.id, a.estatus_pago)}
                                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all ${a.estatus_pago === 'Liquidado' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 hover:border-cyan-500'}`}
                              >
                                {a.estatus_pago === 'Liquidado' && <Check className="w-2.5 h-2.5 text-black" />}
                              </button>
                            </div>
                          </div>

                          {/* Botón WP */}
                          <a
                            href={`https://wa.me/52${a.whatsapp}?text=${encodeURIComponent(`¡Hola ${a.nombre_completo.split(' ')[0]}! 🌿 Tu depósito por $${Number(a.costo_total || 0).toLocaleString('es-MX')} ha sido confirmado. Tu lugar en Cascadas Dos Mundos (1 y 2 de Mayo) está RESERVADO.

🔑 Tu clave de acceso a la App: *${a.passcode}*
Entra en: ${typeof window !== 'undefined' ? window.location.origin : ''}/explorador

¡Nos vemos en la sierra! SERAMBI 🏔️`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <span>📲</span> Notificar WP
                          </a>
                        </div>
                      </div>
                      );
                    })}
                    {asistentes.filter(a => !a.es_admin).length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-8">Aún no hay clientes registrados.</p>
                    )}
                  </div>
                </details>

                <details className="group bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer bg-white/5 p-4 font-bold text-white flex justify-between items-center outline-none">
                    <span>👑 Administradores (Staff) ({asistentes.filter(a => a.es_admin).length})</span>
                    <span className="text-sm px-2 py-1 bg-white/10 rounded">Ver Lista</span>
                  </summary>
                  <div className="p-4 space-y-2">
                    {asistentes.filter(a => a.es_admin).map((a) => (
                      <div key={a.id} className="bg-[#121212] rounded-lg border border-white/5 p-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-white">{a.nombre_completo}</p>
                          <p className="text-xs text-gray-500">{a.whatsapp}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded">ADMIN</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>

              </div>
            )}
          </div>
        )}

        {activeTab === 'acomodo' && (() => {
          // ── Datos derivados de asistentes ──────────────────────────────
          const clientes = asistentes.filter(a => !a.es_admin);

          // Capacidades de transporte
          const CAP_CDMX = 29;
          const CAP_PACHUCA = 18;

          // Agrupar por ciudad
          const pasajerosCDMX = clientes.filter(a => a.ciudad_salida === 'CDMX' || !a.ciudad_salida);
          const pasajerosPachuca = clientes.filter(a => a.ciudad_salida === 'Pachuca');

          // Contar personas totales (titular + acompañantes)
          const contarPersonas = (lista: any[]) =>
            lista.reduce((s, a) => s + 1 + (a.acompanantes?.length || 0), 0);

          const totalCDMX = contarPersonas(pasajerosCDMX);
          const totalPachuca = contarPersonas(pasajerosPachuca);

          // Cabañas
          const porCabana: Record<string, any[]> = {};
          clientes.forEach(a => {
            const cid = a.opciones_viaje?.cabana_id;
            if (cid) {
              if (!porCabana[cid]) porCabana[cid] = [];
              porCabana[cid].push(a);
            }
          });

          const totalCupos = cabanas.reduce((s, c) => s + c.capacidad, 0);
          const totalCabReservados = clientes.filter(a => a.opciones_viaje?.hospedaje === 'Cabaña' && a.opciones_viaje?.cabana_id)
            .reduce((s, a) => {
              const cab = cabanas.find(c => c.id === a.opciones_viaje?.cabana_id);
              if (a.opciones_viaje?.cabana_modo === 'privada' && cab) return s + cab.capacidad;
              return s + (a.opciones_viaje?.cabana_lugares_a_pagar || (1 + (a.acompanantes?.length || 0)));
            }, 0);

          // Campistas
          const campistas = clientes.filter(a => a.opciones_viaje?.hospedaje === 'Camping');
          const campistasPropio = campistas.filter(a => a.opciones_viaje?.camping_equipo !== 'renta');
          const campistasRenta = campistas.filter(a => a.opciones_viaje?.camping_equipo === 'renta');
          const totalCampPersonas = contarPersonas(campistas);
          const carpasRenta = campistasRenta.reduce((s, a) => s + Math.ceil((1 + (a.acompanantes?.length || 0)) / 2), 0);

          // Helper: avatar chip de persona
          const PersonaChip = ({ nombre, pagado, esAcomp = false }: { nombre: string; pagado: boolean; esAcomp?: boolean }) => (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-all ${
              pagado
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pagado ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={esAcomp ? 'opacity-75' : 'font-bold'}>{nombre.split(' ')[0]}</span>
            </div>
          );

          // Helper: asientos visuales de transporte
          const AsientoGrid = ({ cap, personas }: { cap: number; personas: any[] }) => {
            const todos: { nombre: string; pagado: boolean }[] = [];
            personas.forEach(a => {
              todos.push({ nombre: a.nombre_completo, pagado: a.estatus_pago === 'Liquidado' });
              (a.acompanantes || []).forEach((ac: any) => todos.push({ nombre: ac.nombre || '—', pagado: a.estatus_pago === 'Liquidado' }));
            });
            return (
              <div className="grid grid-cols-2 gap-1 mt-3">
                {Array.from({ length: cap }, (_, i) => {
                  const p = todos[i];
                  if (!p) return (
                    <div key={i} className="h-8 rounded-lg border border-dashed border-white/10 flex items-center justify-center">
                      <span className="text-[10px] text-slate-700">Libre</span>
                    </div>
                  );
                  return (
                    <div key={i} className={`h-8 rounded-lg border flex items-center px-2 gap-1.5 text-[10px] font-medium truncate ${
                      p.pagado ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.pagado ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {p.nombre.split(' ')[0]}
                    </div>
                  );
                })}
              </div>
            );
          };

          return (
          <div className="animate-in fade-in space-y-5 pb-4">

            {/* ── HEADER KPIs ─────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">📋</span> Tablero Operativo
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Viajeros CDMX', val: `${totalCDMX}/${CAP_CDMX}`, color: 'text-cyan-400', bg: 'border-cyan-500/20', pct: totalCDMX / CAP_CDMX },
                  { label: 'Viajeros Pachuca', val: `${totalPachuca}/${CAP_PACHUCA}`, color: 'text-violet-400', bg: 'border-violet-500/20', pct: totalPachuca / CAP_PACHUCA },
                  { label: 'Cupos Cabaña', val: `${totalCabReservados}/${totalCupos}`, color: 'text-amber-400', bg: 'border-amber-500/20', pct: totalCupos ? totalCabReservados / totalCupos : 0 },
                  { label: 'Campistas', val: `${totalCampPersonas} pers.`, color: 'text-emerald-400', bg: 'border-emerald-500/20', pct: 0 },
                ].map((k, i) => (
                  <div key={i} className={`bg-[#0a0a0a] border ${k.bg} p-3 rounded-xl`}>
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{k.label}</p>
                    {k.pct > 0 && (
                      <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${k.pct >= 1 ? 'bg-red-500' : k.pct >= 0.8 ? 'bg-amber-500' : 'bg-current opacity-60'} transition-all`}
                          style={{ width: `${Math.min(100, k.pct * 100)}%`, color: k.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── TRANSPORTES ─────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Van CDMX */}
              <div className="bg-[#0a0a0a] border border-cyan-500/20 rounded-2xl overflow-hidden">
                <div className="bg-cyan-500/10 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚌</span>
                    <div>
                      <p className="font-black text-white text-sm">Van CDMX</p>
                      <p className="text-[10px] text-cyan-400">Salida 09:00 hrs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${totalCDMX >= CAP_CDMX ? 'text-red-400' : 'text-cyan-400'}`}>{totalCDMX}/{CAP_CDMX}</p>
                    <p className="text-[10px] text-slate-500">{CAP_CDMX - totalCDMX} libre{CAP_CDMX - totalCDMX !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  {/* Barra de llenado */}
                  <div className="h-2 bg-white/10 rounded-full my-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${totalCDMX >= CAP_CDMX ? 'bg-red-500' : totalCDMX >= CAP_CDMX * 0.8 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, (totalCDMX / CAP_CDMX) * 100)}%` }} />
                  </div>
                  {/* Asientos visuales */}
                  <AsientoGrid cap={CAP_CDMX} personas={pasajerosCDMX} />
                  {pasajerosCDMX.length === 0 && (
                    <p className="text-slate-600 text-xs text-center py-4">Sin pasajeros registrados</p>
                  )}
                </div>
              </div>

              {/* Van Pachuca */}
              <div className="bg-[#0a0a0a] border border-violet-500/20 rounded-2xl overflow-hidden">
                <div className="bg-violet-500/10 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚌</span>
                    <div>
                      <p className="font-black text-white text-sm">Van Pachuca</p>
                      <p className="text-[10px] text-violet-400">Salida 09:00 hrs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${totalPachuca >= CAP_PACHUCA ? 'text-red-400' : 'text-violet-400'}`}>{totalPachuca}/{CAP_PACHUCA}</p>
                    <p className="text-[10px] text-slate-500">{CAP_PACHUCA - totalPachuca} libre{CAP_PACHUCA - totalPachuca !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="h-2 bg-white/10 rounded-full my-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${totalPachuca >= CAP_PACHUCA ? 'bg-red-500' : totalPachuca >= CAP_PACHUCA * 0.8 ? 'bg-amber-500' : 'bg-violet-500'}`}
                      style={{ width: `${Math.min(100, (totalPachuca / CAP_PACHUCA) * 100)}%` }} />
                  </div>
                  <AsientoGrid cap={CAP_PACHUCA} personas={pasajerosPachuca} />
                  {pasajerosPachuca.length === 0 && (
                    <p className="text-slate-600 text-xs text-center py-4">Sin pasajeros registrados</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── CABAÑAS ─────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">🏠 Hospedaje — Cabañas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cabanas.map((cab: any) => {
                  const reservasEnEsta = porCabana[cab.id] || [];
                  const ocupadosEnEsta = reservasEnEsta.reduce((s, a) => {
                    if (a.opciones_viaje?.cabana_modo === 'privada') return s + cab.capacidad;
                    return s + (a.opciones_viaje?.cabana_lugares_a_pagar || (1 + (a.acompanantes?.length || 0)));
                  }, 0);
                  const libres = cab.capacidad - ocupadosEnEsta;
                  const pct = Math.min(100, Math.round((ocupadosEnEsta / cab.capacidad) * 100));
                  const isFull = libres <= 0;

                  return (
                    <div key={cab.id} className={`bg-[#0a0a0a] rounded-xl border overflow-hidden ${
                      isFull ? 'border-red-500/30' : libres <= 1 ? 'border-amber-500/30' : 'border-white/10'
                    }`}>
                      {/* Header cabaña */}
                      <div className={`px-3 py-2 flex justify-between items-center ${
                        isFull ? 'bg-red-500/10' : libres <= 1 ? 'bg-amber-500/10' : 'bg-white/5'
                      }`}>
                        <p className="font-bold text-white text-xs">{cab.nombre}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isFull ? 'bg-red-500/20 text-red-400' :
                          libres <= 1 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isFull ? 'LLENA' : `${libres} libre${libres > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      {/* Barra */}
                      <div className="h-1 bg-white/10 overflow-hidden">
                        <div className={`h-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      {/* Cuadrícula de camas */}
                      <div className="p-3">
                        {cab.tipo === 'sextuple' && (
                          <p className="text-[9px] text-violet-400/70 mb-2">Hostal · 2 matr. + 2 ind.</p>
                        )}
                        {/* Slots de lugares */}
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          {Array.from({ length: cab.capacidad }, (_, i) => {
                            // Determinar si este slot está ocupado
                            let personaEnSlot: { nombre: string; pagado: boolean } | null = null;
                            let slotIdx = 0;
                            for (const a of reservasEnEsta) {
                              const lug = a.opciones_viaje?.cabana_modo === 'privada'
                                ? cab.capacidad
                                : (a.opciones_viaje?.cabana_lugares_a_pagar || (1 + (a.acompanantes?.length || 0)));
                              const personas = [a.nombre_completo, ...(a.acompanantes || []).map((ac: any) => ac.nombre)];
                              for (let j = 0; j < lug; j++) {
                                if (slotIdx === i) {
                                  personaEnSlot = { nombre: personas[j] || a.nombre_completo, pagado: a.estatus_pago === 'Liquidado' };
                                  break;
                                }
                                slotIdx++;
                              }
                              if (personaEnSlot) break;
                            }
                            return personaEnSlot ? (
                              <div key={i} className={`h-7 rounded-md flex items-center px-1.5 text-[9px] font-bold truncate border ${
                                personaEnSlot.pagado
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              }`}>
                                {personaEnSlot.nombre.split(' ')[0]}
                              </div>
                            ) : (
                              <div key={i} className="h-7 rounded-md border border-dashed border-white/10 flex items-center justify-center">
                                <span className="text-[8px] text-slate-700">·</span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Grupos en esta cabaña */}
                        {reservasEnEsta.map((a: any) => (
                          <div key={a.id} className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-slate-400 truncate">{a.nombre_completo.split(' ')[0]}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              a.estatus_pago === 'Liquidado' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{a.estatus_pago === 'Liquidado' ? '✓' : '⏳'}</span>
                          </div>
                        ))}
                        {reservasEnEsta.length === 0 && (
                          <p className="text-slate-700 text-[10px] text-center py-1">Disponible</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CAMPING ─────────────────────────────────── */}
            <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl overflow-hidden">
              <div className="bg-emerald-500/10 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⛺</span>
                  <div>
                    <p className="font-black text-white text-sm">Campamento</p>
                    <p className="text-[10px] text-emerald-400">{totalCampPersonas} persona{totalCampPersonas !== 1 ? 's' : ''} · {campistas.length} grupo{campistas.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <p className="font-black text-white">{campistasPropio.length}</p>
                    <p className="text-[10px] text-slate-500">eq. propio</p>
                  </div>
                  <div>
                    <p className="font-black text-amber-400">{campistasRenta.length}</p>
                    <p className="text-[10px] text-slate-500">rentan carpa</p>
                  </div>
                  <div>
                    <p className="font-black text-cyan-400">{carpasRenta}</p>
                    <p className="text-[10px] text-slate-500">carpas a rentar</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {campistas.length === 0 ? (
                  <p className="text-slate-600 text-xs text-center py-4">Sin campistas registrados aún.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {campistas.map((a: any) => {
                      const personas = [a.nombre_completo, ...(a.acompanantes || []).map((ac: any) => ac.nombre)];
                      const pagado = a.estatus_pago === 'Liquidado';
                      const rentan = a.opciones_viaje?.camping_equipo === 'renta';
                      return (
                        <div key={a.id} className={`flex flex-col px-3 py-2 rounded-xl border text-xs ${
                          pagado ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'
                        }`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${pagado ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span className="font-bold text-white">{a.nombre_completo.split(' ').slice(0, 2).join(' ')}</span>
                            <span className="text-slate-500">{rentan ? '🏕️' : '✅'}</span>
                          </div>
                          <span className="text-slate-500 text-[10px]">{personas.length} pers. · {rentan ? 'Renta carpa' : 'Equipo propio'}</span>
                          {personas.length > 1 && (
                            <span className="text-slate-600 text-[9px] mt-0.5">{personas.slice(1).map(p => p.split(' ')[0]).join(', ')}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── LEYENDA ─────────────────────────────────── */}
            <div className="flex items-center gap-4 text-[10px] text-slate-600 px-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Pago confirmado</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pago pendiente</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700 inline-block" /> Lugar libre</span>
            </div>

          </div>
          );
        })()}


        {activeTab === 'avisos' && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Bell className="mr-2 text-[#ff3939]" /> Enviar Aviso en Vivo
            </h2>
            <form onSubmit={handleAvisoSubmit} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mensaje</label>
                <textarea 
                  required
                  value={avisoMensaje}
                  onChange={(e) => setAvisoMensaje(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#ff3939] focus:outline-none"
                  rows={3}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Urgencia</label>
                <select 
                  value={avisoUrgencia}
                  onChange={(e) => setAvisoUrgencia(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#ff3939] focus:outline-none"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={avisoSubmitting}
                className="w-full bg-[#ff3939]/20 text-[#ff3939] border border-[#ff3939]/50 font-bold rounded-lg py-3 hover:bg-[#ff3939]/30 transition-colors"
              >
                {avisoSubmitting ? 'Enviando...' : 'Transmitir Aviso'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'logistica' && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Map className="mr-2 text-[#39FF14]" /> Logística y Links
            </h2>
            <form onSubmit={handleLogisticaSubmit} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hora</label>
                  <input 
                    type="time" 
                    required
                    value={logisticaHora}
                    onChange={(e) => setLogisticaHora(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#39FF14] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Actividad</label>
                  <input 
                    type="text" 
                    required
                    value={logisticaActividad}
                    onChange={(e) => setLogisticaActividad(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#39FF14] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Link Maps/Waze</label>
                <input 
                  type="url" 
                  value={logisticaLink}
                  onChange={(e) => setLogisticaLink(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#39FF14] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <button 
                type="submit" 
                disabled={logisticaSubmitting}
                className="w-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/50 font-bold rounded-lg py-3 hover:bg-[#39FF14]/20 transition-colors"
              >
                {logisticaSubmitting ? 'Guardando...' : 'Agregar Actividad'}
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-300">Itinerario Actual</h3>
              {logistica.map((item) => (
                <div key={item.id} className="bg-[#0a0a0a] p-4 rounded-lg border border-white/5 flex justify-between items-center group">
                  <div>
                    <span className="text-[#39FF14] font-mono text-sm mr-3">{item.hora}</span>
                    <span className="font-medium">{item.actividad}</span>
                  </div>
                  <button onClick={() => deleteLogistica(item.id)} className="text-gray-500 hover:text-[#ff3939] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'finanzas' && (() => {
          const calcularPlan = (vans: number, turistas: number, staff: number) => {
            const total_personas = turistas + staff;
            const transporte = (vans * Number(finanzas.renta_van)) + vans * ((Number(finanzas.distancia_estimada) / Number(finanzas.rendimiento_km_l)) * Number(finanzas.factor_terreno) * Number(finanzas.precio_gasolina));
            const alimentacion = total_personas * (Number(finanzas.comida_llegada) + Number(finanzas.comida_regreso));
            const entradas = (turistas * Number(finanzas.entrada_turista)) + (staff * Number(finanzas.entrada_staff));
            const extra = Number(finanzas.foto_dron) + Number(finanzas.materiales);
            const costo_base = transporte + alimentacion + entradas + extra;
            const costo_reserva = costo_base * Number(finanzas.modificadores);
            
            return {
              transporte, alimentacion, entradas, extra, costo_base, costo_reserva, turistas, vans
            };
          };

          const planA = calcularPlan(2, 26, 4);
          const planB = calcularPlan(1, 11, 4);

          const getUnitario = (plan: ReturnType<typeof calcularPlan>, costoHospedaje = 0) => {
             const costoBaseTotal = plan.costo_base + (plan.turistas * costoHospedaje);
             return costoBaseTotal / plan.turistas;
          };

          const getSugerido = (plan: ReturnType<typeof calcularPlan>, margen: number, costoHospedaje = 0) => {
             return (getUnitario(plan, costoHospedaje)) / (1 - margen);
          };

          const getGananciaNeta = (plan: ReturnType<typeof calcularPlan>, margen: number, costoHospedaje = 0) => {
             const precioVenta = getSugerido(plan, margen, costoHospedaje);
             const ingresos = precioVenta * plan.turistas;
             const costoBaseViaje = plan.costo_base + (plan.turistas * costoHospedaje);
             const gananciaBruta = ingresos - costoBaseViaje;
             const fondoReserva = costoBaseViaje * (Number(finanzas.modificadores) - 1);
             const neta = gananciaBruta - fondoReserva;
             return neta / Number(finanzas.organizadores);
          };

          const formatM = (num: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

          return (
          <div className="animate-in fade-in space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <DollarSign className="mr-2 text-[#eab308]" /> Finanzas y Proyecciones
              </h2>
              <button 
                onClick={() => setIsEditingFinanzas(!isEditingFinanzas)}
                className="bg-[#121212] border border-white/10 hover:bg-white/5 text-sm px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Settings className="w-4 h-4 mr-2 text-gray-400" /> Configurar Costos
              </button>
            </div>

            {isEditingFinanzas && (
              <form onSubmit={handleFinanzasUpdate} className="bg-[#0a0a0a] p-6 rounded-xl border border-[#eab308]/30 mb-8 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <h3 className="text-lg font-bold text-[#eab308] mb-4">Parámetros Base del Viaje</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Renta Van ($)</label>
                    <input type="number" step="any" value={finanzas.renta_van} onChange={(e) => setFinanzas({...finanzas, renta_van: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Costo Gasolina ($/L)</label>
                    <input type="number" step="any" value={finanzas.precio_gasolina} onChange={(e) => setFinanzas({...finanzas, precio_gasolina: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Distancia Total (Km)</label>
                    <input type="number" step="any" value={finanzas.distancia_estimada} onChange={(e) => setFinanzas({...finanzas, distancia_estimada: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Rendimiento Van (Km/L)</label>
                    <input type="number" step="any" value={finanzas.rendimiento_km_l} onChange={(e) => setFinanzas({...finanzas, rendimiento_km_l: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Factor Terreno (Ej. 1.15)</label>
                    <input type="number" step="any" value={finanzas.factor_terreno} onChange={(e) => setFinanzas({...finanzas, factor_terreno: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Entrada Turista ($)</label>
                    <input type="number" step="any" value={finanzas.entrada_turista} onChange={(e) => setFinanzas({...finanzas, entrada_turista: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Entrada Staff ($)</label>
                    <input type="number" step="any" value={finanzas.entrada_staff} onChange={(e) => setFinanzas({...finanzas, entrada_staff: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Comida Llegada ($)</label>
                    <input type="number" step="any" value={finanzas.comida_llegada} onChange={(e) => setFinanzas({...finanzas, comida_llegada: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Comida Regreso ($)</label>
                    <input type="number" step="any" value={finanzas.comida_regreso} onChange={(e) => setFinanzas({...finanzas, comida_regreso: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Camping p/p ($)</label>
                    <input type="number" step="any" value={finanzas.camping} onChange={(e) => setFinanzas({...finanzas, camping: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Cabaña Compartida p/p ($)</label>
                    <input type="number" step="any" value={finanzas.cabana_3} onChange={(e) => setFinanzas({...finanzas, cabana_3: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" title="Estimado promedio por persona en cabaña" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Materiales/Foto/Seguro ($)</label>
                    <input type="number" step="any" value={finanzas.materiales} onChange={(e) => setFinanzas({...finanzas, materiales: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Modificador Imprevistos</label>
                    <input type="number" step="any" value={finanzas.modificadores} onChange={(e) => setFinanzas({...finanzas, modificadores: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" title="Ej. 1.20 = 20% extra de reserva" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Num. Organizadores</label>
                    <input type="number" step="1" value={finanzas.organizadores} onChange={(e) => setFinanzas({...finanzas, organizadores: e.target.value})} className="w-full bg-[#121212] border border-white/10 rounded p-2 text-sm text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditingFinanzas(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancelar</button>
                  <button type="submit" disabled={finanzasSubmitting} className="bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/50 font-bold rounded-lg px-6 py-2 hover:bg-[#eab308]/30 flex items-center">
                    {finanzasSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[planA, planB].map((plan, idx) => (
                <div key={idx} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                  <h3 className={`text-lg font-bold mb-4 flex items-center ${idx===0?'text-emerald-400':'text-blue-400'}`}>
                    <PieChart className="w-5 h-5 mr-2" /> Plan ${idx===0?'A: 2 Vans':'B: 1 Van'} (${plan.turistas} Turistas)
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Transporte</span>
                      <span>{formatM(plan.transporte)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Alimentación</span>
                      <span>{formatM(plan.alimentacion)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Entradas</span>
                      <span>{formatM(plan.entradas)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Materiales y Dron</span>
                      <span>{formatM(plan.extra)}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-bold text-white">
                      <span>Subtotal Operación (Sin Imprevistos)</span>
                      <span>{formatM(plan.costo_base)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-amber-500/80">
                      <span>Costo Real Asignado (Con Reserva {(Number(finanzas.modificadores)-1)*100}%)</span>
                      <span>{formatM(plan.costo_reserva)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Precios Sugeridos vs. Ganancia</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-white/5">
                    <tr>
                      <th className="px-4 py-3">Escenario</th>
                      <th className="px-4 py-3 text-center">Costo p/p</th>
                      <th className="px-4 py-3 text-emerald-400 text-center">Venta (35% Mg)</th>
                      <th className="px-4 py-3 text-[#39FF14] text-center font-bold">Neta x Organizador</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium text-emerald-400">Plan A - Sin Equipo</td>
                      <td className="px-4 py-3 text-center">{formatM(getUnitario(planA, 0))}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-300">{formatM(getSugerido(planA, 0.35, 0))}</td>
                      <td className="px-4 py-3 text-center font-bold text-[#39FF14] bg-[#39FF14]/5">{formatM(getGananciaNeta(planA, 0.35, 0))}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-3 font-medium text-emerald-400">Plan A - Cabaña</td>
                      <td className="px-4 py-3 text-center">{formatM(getUnitario(planA, Number(finanzas.cabana_3)))}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-300">{formatM(getSugerido(planA, 0.35, Number(finanzas.cabana_3)))}</td>
                      <td className="px-4 py-3 text-center font-bold text-[#39FF14] bg-[#39FF14]/5">{formatM(getGananciaNeta(planA, 0.35, Number(finanzas.cabana_3)))}</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-4 py-3 font-medium text-blue-400">Plan B - Sin Equipo</td>
                      <td className="px-4 py-3 text-center">{formatM(getUnitario(planB, 0))}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-300">{formatM(getSugerido(planB, 0.35, 0))}</td>
                      <td className="px-4 py-3 text-center font-bold text-[#39FF14] bg-[#39FF14]/5">{formatM(getGananciaNeta(planB, 0.35, 0))}</td>
                    </tr>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-4 py-3 font-medium text-blue-400">Plan B - Cabaña</td>
                      <td className="px-4 py-3 text-center">{formatM(getUnitario(planB, Number(finanzas.cabana_3)))}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-300">{formatM(getSugerido(planB, 0.35, Number(finanzas.cabana_3)))}</td>
                      <td className="px-4 py-3 text-center font-bold text-[#39FF14] bg-[#39FF14]/5">{formatM(getGananciaNeta(planB, 0.35, Number(finanzas.cabana_3)))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">* Precio Venta = Costo Operativo / (1 - Margen). La Ganancia Neta es Real descontando ya la reserva para imprevistos guardada en caja.</p>
            </div>

          </div>
          );
        })()}
        
        {activeTab === 'proveedores' && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Truck className="mr-2 text-violet-400" /> Directorio de Proveedores
            </h2>
            <form onSubmit={handleProvSubmit} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre Comercial/Persona</label>
                  <input 
                    type="text" required value={provNombre} onChange={(e) => setProvNombre(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-violet-400 focus:outline-none"
                    placeholder="Ej. Transportes Martínez"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tipo de Servicio</label>
                  <input 
                    type="text" required value={provServicio} onChange={(e) => setProvServicio(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-violet-400 focus:outline-none"
                    placeholder="Ej. Renta de Vans, Cabañas, Paramédico"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contacto (Teléfono/Email)</label>
                <input 
                  type="text" value={provContacto} onChange={(e) => setProvContacto(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-violet-400 focus:outline-none"
                  placeholder="55-1234-5678"
                />
              </div>
              <button 
                type="submit" disabled={provSubmitting}
                className="w-full bg-violet-500/20 text-violet-400 border border-violet-500/50 font-bold rounded-lg py-3 hover:bg-violet-500/30 transition-colors"
              >
                {provSubmitting ? 'Guardando...' : 'Agregar Proveedor'}
              </button>
            </form>

            <div className="space-y-3">
              {proveedores.map((item) => (
                <div key={item.id} className="bg-[#0a0a0a] p-4 rounded-lg border border-white/5 flex justify-between items-center group">
                  <div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-white mr-2">{item.nombre}</span>
                      <span className="text-violet-400 text-xs px-2 py-0.5 rounded bg-violet-400/10 border border-violet-400/20">{item.servicio}</span>
                    </div>
                    {item.contacto && <p className="text-gray-400 text-sm mt-1">{item.contacto}</p>}
                  </div>
                  <button onClick={() => deleteProveedor(item.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {proveedores.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-white/5 rounded-lg">No hay proveedores registrados aún.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('asistentes')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'asistentes' ? 'text-[#00f0ff]' : 'text-gray-500'}`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Reservas</span>
          </button>
          <button 
            onClick={() => setActiveTab('acomodo')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'acomodo' ? 'text-cyan-400' : 'text-gray-500'}`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Acomodo</span>
          </button>
          <button 
            onClick={() => setActiveTab('avisos')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'avisos' ? 'text-[#ff3939]' : 'text-gray-500'}`}
          >
            <Bell className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Avisos</span>
          </button>
          <button 
            onClick={() => setActiveTab('logistica')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'logistica' ? 'text-[#39FF14]' : 'text-gray-500'}`}
          >
            <Map className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Logística</span>
          </button>
          <button 
            onClick={() => setActiveTab('finanzas')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'finanzas' ? 'text-[#eab308]' : 'text-gray-500'}`}
          >
            <DollarSign className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Finanzas</span>
          </button>
          <button 
            onClick={() => setActiveTab('proveedores')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'proveedores' ? 'text-violet-400' : 'text-gray-500'}`}
          >
            <Truck className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Provedores</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
