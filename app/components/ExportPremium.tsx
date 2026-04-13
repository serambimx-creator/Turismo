'use client';

import { useRef, useState } from 'react';
import { X, Download, Printer, Users, Calendar, MapPin, Tent, Home, Utensils, ShieldCheck, Zap } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface ExportPremiumProps {
  asistentes: any[];
  cabanas: any[];
  onClose: () => void;
}

export default function ExportPremium({ asistentes, cabanas, onClose }: ExportPremiumProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const clientes = asistentes.filter(a => !a.es_admin);
  
  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(reportRef.current, { 
        quality: 0.95, 
        pixelRatio: 2,
        backgroundColor: '#fdfbf7' 
      });
      const link = document.createElement('a');
      link.download = `Reporte_SERAMBI_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar imagen:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10 overflow-hidden">
      <div className="bg-white w-full max-w-6xl h-full rounded-[40px] flex flex-col shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 bg-stone-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">Generador de Reporte Premium</h2>
            <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mt-1">SERAMBI EXPEDITIONS • V1.0</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isExporting ? <Zap className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
              Descargar Imagen (Ultra HD)
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="flex-1 overflow-y-auto bg-stone-100 p-8 scroll-smooth">
          <div 
            ref={reportRef} 
            className="bg-[#fdfbf7] min-h-[1200px] w-full max-w-[1000px] mx-auto shadow-2xl p-12 text-stone-900 font-sans selection:bg-emerald-100"
          >
            {/* Header Reporte */}
            <div className="flex justify-between items-start border-b-4 border-emerald-800 pb-10 mb-10">
              <div className="max-w-md">
                <div className="bg-emerald-800 text-white px-4 py-1 inline-block rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                  Reporte Maestro de Expedición
                </div>
                <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none mb-4">
                  Cascadas <br /> <span className="text-emerald-700">Dos Mundos</span>
                </h1>
                <div className="flex gap-6 text-sm font-bold text-stone-500">
                  <span className="flex items-center gap-2 italic"><Calendar className="w-4 h-4 text-emerald-600" /> 1 y 2 de Mayo, 2026</span>
                  <span className="flex items-center gap-2 italic"><MapPin className="w-4 h-4 text-emerald-600" /> Acaxochitlán, Hidalgo</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-emerald-800 italic uppercase leading-none">{clientes.length}</div>
                <div className="text-[10px] font-black text-stone-400 tracking-widest uppercase">Registros Totales</div>
                <div className="mt-8">
                    <div className="text-2xl font-black text-emerald-700">${clientes.reduce((acc, c) => acc + Number(c.costo_total || 0), 0).toLocaleString('es-MX')}</div>
                    <div className="text-[10px] font-black text-stone-400 tracking-widest uppercase">Ingreso Bruto Proyectado</div>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-800 rounded-2xl flex items-center justify-center">
                            <Users className="text-white w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black text-emerald-800 tracking-widest uppercase">Viajeros</h3>
                    </div>
                    <p className="text-xs text-emerald-900/60 font-bold italic mb-1 uppercase">Total de personas</p>
                    <p className="text-3xl font-black text-emerald-900">{clientes.reduce((acc, c) => acc + 1 + (c.acompanantes?.length || 0), 0)}</p>
                </div>

                <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center">
                            <Home className="text-white w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black text-amber-600 tracking-widest uppercase">Cabañas</h3>
                    </div>
                    <p className="text-xs text-amber-900/60 font-bold italic mb-1 uppercase">Ocupación</p>
                    <p className="text-3xl font-black text-amber-900">
                        {clientes.filter(c => c.hospedaje === 'Cabaña').length} <span className="text-sm">Grupos</span>
                    </p>
                </div>

                <div className="bg-cyan-50 p-6 rounded-[32px] border border-cyan-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-cyan-600 rounded-2xl flex items-center justify-center">
                            <Tent className="text-white w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black text-cyan-600 tracking-widest uppercase">Camping</h3>
                    </div>
                    <p className="text-xs text-cyan-900/60 font-bold italic mb-1 uppercase">Exploradores</p>
                    <p className="text-3xl font-black text-cyan-900">
                        {clientes.filter(c => c.hospedaje === 'Camping').length} <span className="text-sm">Grupos</span>
                    </p>
                </div>
            </div>

            {/* Tabla Maestra */}
            <div className="mb-12">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-700 w-8 h-8" />
                    Padrón Maestro de Asistentes
                </h2>
                <div className="overflow-hidden rounded-[40px] border border-stone-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-900 text-white uppercase text-[9px] font-black tracking-widest">
                                <th className="p-5">Estatus</th>
                                <th className="p-5">Nombre Principal</th>
                                <th className="p-5">WhatsApp</th>
                                <th className="p-5">Origen</th>
                                <th className="p-5">Hospedaje detallado</th>
                                <th className="p-5 text-right">Total MXN</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold italic">
                            {clientes.map((c, i) => {
                                const pagado = c.estatus_pago === 'Liquidado';
                                return (
                                <tr key={c.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'} border-b border-stone-100`}>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${pagado ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                                            {pagado ? 'Liquidado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-stone-900">{c.nombre_completo}</div>
                                        {c.acompanantes?.length > 0 && (
                                            <div className="text-[9px] text-stone-400 mt-0.5">+{c.acompanantes.length} acompañantes</div>
                                        )}
                                    </td>
                                    <td className="p-5 font-mono text-stone-500">{c.whatsapp}</td>
                                    <td className="p-5">{c.ciudad_salida}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            {c.hospedaje === 'Cabaña' ? <Home className="w-3.5 h-3.5 text-amber-500" /> : <Tent className="w-3.5 h-3.5 text-emerald-500" />}
                                            <span>{c.hospedaje} {c.opciones_viaje?.cabana_nombre || ''}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right text-emerald-800 font-black">
                                        ${Number(c.costo_total || 0).toLocaleString()}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Reporte */}
            <div className="grid grid-cols-2 gap-10 pt-10 border-t-2 border-dashed border-stone-200">
                <div>
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 italic">Notas Logísticas</h4>
                    <ul className="space-y-2 text-[11px] font-bold text-stone-600 italic">
                        <li className="flex gap-2">🌿 <span className="opacity-80">Check-in de transporte en puntos de origen: 07:30 AM.</span></li>
                        <li className="flex gap-2">🍽️ <span className="opacity-80">Total Buffets Tlalli contratados: {asistentes.reduce((acc, a) => {
                            let count = a.opciones_viaje?.buffet_titular ? 1 : 0;
                            count += (a.acompanantes || []).filter((ac: any) => ac.buffet_extra).length;
                            return acc + count;
                        }, 0)} servicios.</span></li>
                    </ul>
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                    <div className="opacity-40 grayscale mb-4">
                        <img src="/serambi logo(1).png" alt="Logo" className="h-8 w-auto grayscale" />
                    </div>
                    <p className="text-[9px] text-stone-400 font-black uppercase tracking-[0.4em]">SERAMBI EXPEDITIONS • NATURALEZA Y AVENTURA</p>
                    <p className="text-[8px] text-emerald-600/50 font-black uppercase mt-1">Generado el {new Date().toLocaleDateString('es-MX')} • War Room Admin</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
