'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ChevronRight, ChevronLeft, Plus, Trash2, CheckCircle, Download, Tent, Home, Utensils, User, Users, AlertCircle, Edit3 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import * as htmlToImage from 'html-to-image';

// ──────────────────────────────────
// TYPES
// ──────────────────────────────────
interface Acompanante {
  nombre: string;
  edad: string;
  buffet_extra: boolean;
}

interface CabanaInventario {
  id: string;
  nombre: string;
  tipo: 'sextuple' | 'cuadruple' | 'triple';
  capacidad: number;
  precio_total: number;
  descripcion: string;
  ocupantes: { reserva_id: string; nombre_titular: string; lugares: number }[];
  activa: boolean;
}

interface Opciones {
  hospedaje: 'Camping' | 'Cabaña';
  camping_equipo: 'propio' | 'renta';
  cabana_modo: 'privada' | 'compartida';
  cabana_id: string;
  cabana_nombre: string;
  cabana_tipo: string;
  cabana_capacidad: number;
  cabana_precio_total: number;
  cabana_lugares_a_pagar: number;
  buffet_titular: boolean;
}

// ──────────────────────────────────
// COMPONENT
// ──────────────────────────────────
export default function ConstructorPaquete({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;
  const [finanzas, setFinanzas] = useState<any>(null);
  const [cabanas, setCabanas] = useState<CabanaInventario[]>([]);
  const [loadingCabanas, setLoadingCabanas] = useState(true);

  // Form State
  const [titular, setTitular] = useState({ nombre: '', edad: '', whatsapp: '', ciudad: 'CDMX' });
  const [acompanantes, setAcompanantes] = useState<Acompanante[]>([]);
  const [opciones, setOpciones] = useState<Opciones>({
    hospedaje: 'Camping',
    camping_equipo: 'propio',
    cabana_modo: 'compartida',
    cabana_id: '',
    cabana_nombre: '',
    cabana_tipo: '',
    cabana_capacidad: 0,
    cabana_precio_total: 0,
    cabana_lugares_a_pagar: 1,
    buffet_titular: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passcodeGenerated, setPasscodeGenerated] = useState('');
  const [totalCalculado, setTotalCalculado] = useState(0);
  const [desglose, setDesglose] = useState<{ concepto: string; monto: number }[]>([]);

  const ticketRef = useRef<HTMLDivElement>(null);

  // ──────────────────────────────────
  // DATA LOADING
  // ──────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabase();
      const [{ data: fin }, { data: cabs }] = await Promise.all([
        supabase.from('configuracion_finanzas').select('*').limit(1).single(),
        supabase.from('cabanas_inventario').select('*').eq('activa', true).order('tipo'),
      ]);
      if (fin) setFinanzas(fin);
      if (cabs) setCabanas(cabs as CabanaInventario[]);
      setLoadingCabanas(false);
    };
    fetchData();
  }, []);

  // ──────────────────────────────────
  // CALCULAR TOTAL
  // ──────────────────────────────────
  useEffect(() => {
    if (!finanzas) return;
    calcularTotal();
  }, [acompanantes, opciones, finanzas, titular]);

  const calcularTotal = () => {
    if (!finanzas) return;
    const totalPersonas = 1 + acompanantes.length;
    const items: { concepto: string; monto: number }[] = [];

    // Ticket base (Transporte + Entrada)
    const ticketBase = Number(finanzas.precio_ticket_base || 980);
    items.push({ concepto: `Ticket base × ${totalPersonas} persona${totalPersonas > 1 ? 's' : ''} (transporte + entrada)`, monto: totalPersonas * ticketBase });

    // Hospedaje
    if (opciones.hospedaje === 'Camping') {
      const campingBase = Number(finanzas.camping || 120) * totalPersonas;
      items.push({ concepto: `Camping × ${totalPersonas} persona${totalPersonas > 1 ? 's' : ''} (equipo propio)`, monto: campingBase });
      if (opciones.camping_equipo === 'renta') {
        const extra = Number(finanzas.camping_renta_extra || 100) * totalPersonas;
        items.push({ concepto: `Renta de casa de campaña × ${totalPersonas}`, monto: extra });
      }
    } else if (opciones.hospedaje === 'Cabaña' && opciones.cabana_id) {
      if (opciones.cabana_modo === 'privada') {
        items.push({ concepto: `${opciones.cabana_nombre} (renta completa privada)`, monto: opciones.cabana_precio_total });
      } else {
        const precioPorLugar = opciones.cabana_precio_total / opciones.cabana_capacidad;
        const lugaresPagados = opciones.cabana_lugares_a_pagar;
        items.push({ concepto: `${opciones.cabana_nombre} — ${lugaresPagados} lugar${lugaresPagados > 1 ? 'es' : ''} compartido${lugaresPagados > 1 ? 's' : ''} × $${precioPorLugar.toFixed(0)}`, monto: lugaresPagados * precioPorLugar });
      }
    }

    // Buffet titular
    if (opciones.buffet_titular) {
      items.push({ concepto: 'Buffet Tlalli (regreso) — Titular', monto: Number(finanzas.buffet_extra || 150) });
    }
    // Buffet acompañantes
    acompanantes.forEach(a => {
      if (a.buffet_extra) {
        items.push({ concepto: `Buffet Tlalli (regreso) — ${a.nombre || 'Acompañante'}`, monto: Number(finanzas.buffet_extra || 150) });
      }
    });

    const total = items.reduce((acc, i) => acc + i.monto, 0);
    setDesglose(items);
    setTotalCalculado(total);
  };

  // ──────────────────────────────────────
  // CABANA HELPERS
  // ──────────────────────────────────────
  const lugaresOcupados = (c: CabanaInventario) =>
    c.ocupantes.reduce((sum, o) => sum + o.lugares, 0);
  const lugaresLibres = (c: CabanaInventario) =>
    c.capacidad - lugaresOcupados(c);

  const selectCabana = (c: CabanaInventario) => {
    setOpciones(prev => ({
      ...prev,
      cabana_id: c.id,
      cabana_nombre: c.nombre,
      cabana_tipo: c.tipo,
      cabana_capacidad: c.capacidad,
      cabana_precio_total: c.precio_total,
      cabana_lugares_a_pagar: 1 + acompanantes.length,
    }));
  };

  // ──────────────────────────────────────
  // SUBMIT
  // ──────────────────────────────────────
  const submitForm = async () => {
    setIsSubmitting(true);
    const supabase = getSupabase();
    const wp = titular.whatsapp.trim();
    let passcode = wp.slice(-4);
    if (passcode.length < 4) passcode = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscodeGenerated(passcode);

    const { data: asistente, error: asistError } = await supabase.from('asistentes').insert([{
      nombre_completo: titular.nombre,
      whatsapp: wp,
      ciudad_salida: titular.ciudad,
      hospedaje: opciones.hospedaje,
      passcode,
      acompanantes: acompanantes.map(a => ({ nombre: a.nombre, edad: a.edad })),
      opciones_viaje: {
        ...opciones,
        buffet_titular: opciones.buffet_titular,
        acompanantes_buffet: acompanantes.filter(a => a.buffet_extra).map(a => a.nombre),
        edad_titular: titular.edad,
      },
      costo_total: totalCalculado,
    }]).select().single();

    // Si eligió cabaña, actualizar inventario
    if (!asistError && asistente && opciones.hospedaje === 'Cabaña' && opciones.cabana_id) {
      const cabanaActual = cabanas.find(c => c.id === opciones.cabana_id);
      if (cabanaActual) {
        const lugaresAReservar = opciones.cabana_modo === 'privada' ? opciones.cabana_capacidad : opciones.cabana_lugares_a_pagar;
        const nuevosOcupantes = [
          ...cabanaActual.ocupantes,
          {
            reserva_id: asistente.id,
            nombre_titular: titular.nombre,
            nombres_en_cabana: [titular.nombre, ...acompanantes.map(a => a.nombre)],
            lugares: lugaresAReservar,
          }
        ];
        await supabase.from('cabanas_inventario').update({ ocupantes: nuevosOcupantes }).eq('id', opciones.cabana_id);
      }
    }

    setIsSubmitting(false);
    if (!asistError) {
      setIsSuccess(true);
    } else {
      alert('Hubo un error al guardar tu registro. Por favor intenta de nuevo: ' + asistError.message);
    }
  };

  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(ticketRef.current, { quality: 0.95, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `Reserva_SERAMBI_${titular.nombre.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error generando imagen', err);
      }
    }
  };

  // ──────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm';
  const labelCls = 'block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5';

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300">
        <strong>¡Bienvenido!</strong> Cuéntanos quién eres y quién viene contigo. El paso es rápido, te lo prometemos 🌱
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Tu Nombre Completo</label>
          <input className={inputCls} placeholder="Ej. María García López" value={titular.nombre} onChange={e => setTitular({ ...titular, nombre: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Edad</label>
          <input className={inputCls} type="number" min="1" max="99" placeholder="Ej. 32" value={titular.edad} onChange={e => setTitular({ ...titular, edad: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Ciudad de Salida</label>
          <select className={inputCls} value={titular.ciudad} onChange={e => setTitular({ ...titular, ciudad: e.target.value })}>
            <option value="CDMX">CDMX</option>
            <option value="Pachuca">Pachuca</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Número de WhatsApp (10 dígitos)</label>
          <input className={`${inputCls} font-mono`} type="tel" placeholder="5512345678" maxLength={10} value={titular.whatsapp} onChange={e => setTitular({ ...titular, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Acompañantes</h4>
          <button onClick={() => setAcompanantes([...acompanantes, { nombre: '', edad: '', buffet_extra: false }])} className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Agregar
          </button>
        </div>
        {acompanantes.length === 0 && <p className="text-slate-500 text-xs text-center py-4">Viaja solo o agrega a tus acompañantes aquí.</p>}
        <div className="space-y-3">
          {acompanantes.map((a, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder={`Nombre Acompañante ${i + 1}`} value={a.nombre} onChange={e => { const updated = [...acompanantes]; updated[i].nombre = e.target.value; setAcompanantes(updated); }} />
                  <input className={inputCls} placeholder="Edad" type="number" min="1" max="99" value={a.edad} onChange={e => { const updated = [...acompanantes]; updated[i].edad = e.target.value; setAcompanantes(updated); }} />
                </div>
                <button onClick={() => setAcompanantes(acompanantes.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg transition-colors mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h4 className="font-bold text-white text-lg flex items-center gap-2"><Home className="w-5 h-5 text-cyan-400" /> Personaliza tu Hospedaje</h4>

      {/* Tipo de Hospedaje */}
      <div className="grid grid-cols-2 gap-3">
        {(['Camping', 'Cabaña'] as const).map(tipo => (
          <button key={tipo} onClick={() => setOpciones({ ...opciones, hospedaje: tipo })} className={`p-4 rounded-xl border-2 text-left transition-all ${opciones.hospedaje === tipo ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
            <div className="text-2xl mb-1">{tipo === 'Camping' ? '⛺' : '🏠'}</div>
            <div className="font-bold text-white">{tipo}</div>
            <div className="text-xs text-slate-400 mt-1">{tipo === 'Camping' ? 'Bajo las estrellas' : 'Cabaña asignada'}</div>
          </button>
        ))}
      </div>

      {/* Camping opciones */}
      {opciones.hospedaje === 'Camping' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-slate-300">¿Llevas tu equipo de acampar?</p>
            {[{ val: 'propio', label: '✅ Equipo Propio', desc: '$120 por persona (carpas, sleeping, etc.)' }, { val: 'renta', label: '🏕️ Rentar Casa de Campaña', desc: '$120 + $100 extra por persona' }].map(op => (
              <button key={op.val} onClick={() => setOpciones({ ...opciones, camping_equipo: op.val as any })} className={`w-full text-left p-3 rounded-xl border transition-all ${opciones.camping_equipo === op.val ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="font-bold text-sm text-white">{op.label}</div>
                <div className="text-xs text-slate-400">{op.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cabañas opciones */}
      {opciones.hospedaje === 'Cabaña' && (
        <div className="space-y-4 animate-in fade-in">
          {loadingCabanas ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
          ) : (
            <>
              {/* Agrupadas por tipo */}
              {(['sextuple', 'cuadruple', 'triple'] as const).map(tipo => {
                const cabanasTipo = cabanas.filter(c => c.tipo === tipo);
                if (!cabanasTipo.length) return null;
                const labels: Record<string, string> = { sextuple: '6 Personas (Hostal)', cuadruple: '4 Personas', triple: '3 Personas' };
                return (
                  <div key={tipo}>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cabañas para {labels[tipo]}</h5>
                    <div className="space-y-2">
                      {cabanasTipo.map(c => {
                        const libres = lugaresLibres(c);
                        const selected = opciones.cabana_id === c.id;
                        const isFull = libres <= 0;
                        return (
                          <button key={c.id} disabled={isFull} onClick={() => selectCabana(c)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-cyan-500 bg-cyan-500/10' : isFull ? 'border-red-500/30 bg-red-500/5 opacity-60 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-white text-sm">{c.nombre}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{c.descripcion}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-white">${c.precio_total.toLocaleString('es-MX')}</div>
                                <div className={`text-xs font-bold mt-0.5 ${libres > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {isFull ? '🔴 Llena' : `🟢 ${libres} lugar${libres > 1 ? 'es' : ''} disponible${libres > 1 ? 's' : ''}`}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Si seleccionó cabaña, preguntar modo */}
              {opciones.cabana_id && (
                <div className="bg-[#0a0a0a] border border-cyan-500/20 rounded-xl p-4 space-y-3 animate-in fade-in">
                  <p className="text-sm font-bold text-slate-300">¿Cómo quieres ocupar la cabaña?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setOpciones({ ...opciones, cabana_modo: 'compartida' })} className={`p-3 rounded-xl border text-left transition-all ${opciones.cabana_modo === 'compartida' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10'}`}>
                      <div className="font-bold text-sm text-white">🤝 Compartida</div>
                      <div className="text-xs text-slate-400 mt-1">Pagas solo los lugares que ocupas. Se divide entre grupos.</div>
                    </button>
                    <button onClick={() => setOpciones({ ...opciones, cabana_modo: 'privada' })} className={`p-3 rounded-xl border text-left transition-all ${opciones.cabana_modo === 'privada' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}>
                      <div className="font-bold text-sm text-white">🏡 Privada</div>
                      <div className="text-xs text-slate-400 mt-1">Rentas toda la cabaña. Precio completo (${opciones.cabana_precio_total.toLocaleString()}).</div>
                    </button>
                  </div>
                  {opciones.cabana_modo === 'compartida' && (
                    <div>
                      <label className={labelCls}>¿Cuántos lugares necesitas?</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setOpciones({ ...opciones, cabana_lugares_a_pagar: Math.max(1, opciones.cabana_lugares_a_pagar - 1) })} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">-</button>
                        <span className="text-xl font-black text-white w-8 text-center">{opciones.cabana_lugares_a_pagar}</span>
                        <button onClick={() => setOpciones({ ...opciones, cabana_lugares_a_pagar: Math.min(lugaresLibres(cabanas.find(c => c.id === opciones.cabana_id)!), opciones.cabana_lugares_a_pagar + 1) })} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">+</button>
                        <span className="text-xs text-slate-400">de {cabanas.find(c => c.id === opciones.cabana_id) ? lugaresLibres(cabanas.find(c => c.id === opciones.cabana_id)!) : 0} disponibles</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const todas = [{ key: 'titular', nombre: titular.nombre || 'Titular' }, ...acompanantes.map((a, i) => ({ key: `acomp_${i}`, nombre: a.nombre || `Acompañante ${i + 1}` }))];
    return (
      <div className="space-y-5">
        <h4 className="font-bold text-white text-lg flex items-center gap-2"><Utensils className="w-5 h-5 text-amber-400" /> Personaliza tus Alimentos</h4>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm space-y-1">
          <p className="font-bold text-emerald-400">✅ Ya incluido en tu paquete:</p>
          <p className="text-slate-300">🍽️ <strong>Buffet en Cascadas</strong> — 1 de Mayo (Día 1)</p>
          <p className="text-slate-300">🥣 <strong>Desayuno Buffet</strong> — 2 de Mayo (Día 2, antes de salir)</p>
        </div>

        <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl p-4">
          <p className="text-sm font-bold text-amber-400 mb-1">🍽️ Buffet Tlalli — Viaje de Regreso (Opcional)</p>
          <p className="text-xs text-slate-400 mb-4">Parada gastronómica especial en Acaxochitlán antes de llegar a tu ciudad. +$150 por persona.</p>

          <div className="space-y-2">
            {todas.map(p => {
              const isTitular = p.key === 'titular';
              const checked = isTitular ? opciones.buffet_titular : acompanantes[parseInt(p.key.split('_')[1])].buffet_extra;
              return (
                <button
                  key={p.key}
                  onClick={() => {
                    if (isTitular) {
                      setOpciones({ ...opciones, buffet_titular: !opciones.buffet_titular });
                    } else {
                      const idx = parseInt(p.key.split('_')[1]);
                      const updated = [...acompanantes];
                      updated[idx].buffet_extra = !updated[idx].buffet_extra;
                      setAcompanantes(updated);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${checked ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'border-amber-500 bg-amber-500' : 'border-white/30'}`}>
                      {checked && <span className="text-black text-xs font-black">✓</span>}
                    </div>
                    <span className="text-sm font-medium text-white">{p.nombre}</span>
                    {isTitular && <span className="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded">titular</span>}
                  </div>
                  <span className="text-amber-400 font-bold text-sm">+$150</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-5">
      <h4 className="font-bold text-white text-lg">📋 Resumen de tu Reserva</h4>

      {/* Personas */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Viajeros</p>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold">{titular.nombre}</span>
          <span className="text-slate-500">— {titular.edad} años • {titular.ciudad}</span>
        </div>
        {acompanantes.map((a, i) => (
          <div key={i} className="flex items-center gap-2 text-sm pl-2">
            <span className="text-slate-500">└</span>
            <span className="text-slate-300">{a.nombre || `Acompañante ${i + 1}`}</span>
            <span className="text-slate-500">— {a.edad} años</span>
          </div>
        ))}
      </div>

      {/* Desglose de costo */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Desglose de Costo</p>
        {desglose.map((item, i) => (
          <div key={i} className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-400 leading-relaxed flex-1">{item.concepto}</span>
            <span className="text-sm font-bold text-white whitespace-nowrap">${item.monto.toLocaleString('es-MX')}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
          <span className="font-black text-white">TOTAL</span>
          <span className="font-black text-2xl text-emerald-400">${totalCalculado.toLocaleString('es-MX')}</span>
        </div>
      </div>

      {/* Instrucciones de pago */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
        <p className="text-sm font-black text-amber-400">⏰ ¡Importante! Anticipo en 24 horas</p>
        <p className="text-xs text-slate-400">Para que sea válida tu reservación, debes realizar el pago del anticipo dentro de las próximas <strong className="text-white">24 horas</strong>.</p>
        <div className="bg-[#0a0a0a] rounded-lg p-3 font-mono text-xs space-y-1 border border-white/5">
          <p className="text-slate-500">CLABE: <span className="text-white">638180010119530280</span></p>
          <p className="text-slate-500">Cuenta: <span className="text-white">01011953028</span></p>
          <p className="text-slate-500">Beneficiario: <span className="text-white">Karla Paola Uribe Valero</span></p>
          <p className="text-amber-400 font-bold">Concepto: <span className="text-white">{titular.nombre || 'Tu nombre'}</span></p>
        </div>
      </div>

      <button onClick={() => setStep(1)} className="w-full text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-xl transition-colors">
        <Edit3 className="w-4 h-4" /> Modificar mi reserva
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <h3 className="text-2xl font-bold text-white">¡Lugar Apartado!</h3>
        <p className="text-slate-400 mt-2 text-sm">Tu reserva fue exitosa. Descarga tu comprobante con las instrucciones de pago.</p>
      </div>

      <div ref={ticketRef} className="bg-[#141414] p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden mb-6" style={{ width: '380px', margin: '0 auto' }}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="text-center border-b border-white/10 pb-4 mb-4">
          <p className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase">Reserva Confirmada</p>
          <h2 className="text-2xl font-black text-white mt-1">SERAMBI</h2>
          <p className="text-slate-500 text-xs mt-0.5">Cascadas Dos Mundos Huetziatl • 1 y 2 de Mayo</p>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Titular:</span>
            <span className="text-white font-bold">{titular.nombre}</span>
          </div>
          {acompanantes.length > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Acompañantes:</span>
              <span className="text-white">{acompanantes.map(a => a.nombre).join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Hospedaje:</span>
            <span className="text-white">{opciones.hospedaje === 'Cabaña' ? `${opciones.cabana_nombre} (${opciones.cabana_modo})` : `Camping (${opciones.camping_equipo === 'propio' ? 'Equipo propio' : 'Renta de carpa'})`}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Buffet Tlalli (regreso):</span>
            <span className="text-white">{[opciones.buffet_titular ? titular.nombre : null, ...acompanantes.filter(a => a.buffet_extra).map(a => a.nombre)].filter(Boolean).join(', ') || 'No incluido'}</span>
          </div>
          <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-black">
            <span className="text-slate-400">Total a Pagar</span>
            <span className="text-emerald-400">${totalCalculado.toLocaleString('es-MX')}</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 text-center mb-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Datos para tu Depósito</p>
          <p className="font-mono text-xs text-white mb-0.5">CLABE: 638180010119530280</p>
          <p className="font-mono text-xs text-white mb-0.5">Cuenta: 01011953028</p>
          <p className="text-xs text-slate-400">Karla Paola Uribe Valero</p>
          <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
            <p className="text-[10px] text-amber-300">Concepto de transferencia:</p>
            <p className="text-amber-400 font-black text-sm">{titular.nombre}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-slate-500 mb-2">Tu clave de acceso al Portal:</p>
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-3xl font-black px-6 py-2 rounded-xl tracking-[0.4em]">
            {passcodeGenerated}
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Pago del anticipo requerido en las próximas 24 horas.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-2">
        <button onClick={handleDownloadTicket} className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold rounded-xl py-3 hover:bg-emerald-500/30 transition-colors flex justify-center items-center gap-2">
          <Download className="w-5 h-5" /> Descargar Comprobante
        </button>
        <a href="https://chat.whatsapp.com/" target="_blank" rel="noreferrer" className="w-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 font-bold rounded-xl py-3 hover:bg-[#25D366]/30 transition-colors text-center text-sm">
          📲 Unirse al Grupo de WhatsApp
        </a>
      </div>
    </div>
  );

  const canAdvance = () => {
    if (step === 1) return titular.nombre.trim() && titular.edad.trim() && titular.whatsapp.length === 10;
    if (step === 2) {
      if (opciones.hospedaje === 'Camping') return true;
      return !!opciones.cabana_id;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl max-h-[95dvh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-black text-white text-lg">Construye tu Paquete</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cascadas Dos Mundos • 1 y 2 de Mayo</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {!isSuccess && (
          <div className="px-5 pt-4 shrink-0">
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-emerald-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <div className="flex justify-between mt-2 px-0.5">
              {['Personas', 'Hospedaje', 'Alimentos', 'Confirmar'].map((label, i) => (
                <span key={i} className={`text-[10px] font-bold transition-colors ${i + 1 <= step ? 'text-emerald-400' : 'text-slate-600'}`}>{label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!finanzas ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
          ) : isSuccess ? renderSuccess() : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </>
          )}
        </div>

        {/* Footer Nav */}
        {!isSuccess && (
          <div className="p-5 border-t border-white/10 shrink-0 flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl font-bold transition-colors">
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            <button
              onClick={() => step < TOTAL_STEPS ? setStep(step + 1) : submitForm()}
              disabled={!canAdvance() || isSubmitting}
              className="flex-1 bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : step === TOTAL_STEPS ? '✅ Confirmar Reserva' : <>Siguiente <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
