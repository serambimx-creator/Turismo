'use client';

import { useState } from 'react';
import { MapPin, Calendar, CheckCircle, Leaf, X, Loader2, ArrowRight, Menu } from 'lucide-react';
import Image from 'next/image';
import ConstructorPaquete from './components/ConstructorPaquete';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#121212]/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Image 
                src="/serambi logo(1).png" 
                alt="SERAMBI Logo" 
                width={120} 
                height={40} 
                className="object-contain h-10 w-auto brightness-0 invert"
                priority
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#destino" className="text-slate-400 hover:text-emerald-400 font-medium transition-colors">Destino</a>
              <a href="#experiencias" className="text-slate-400 hover:text-emerald-400 font-medium transition-colors">Experiencias</a>
              <a href="#nosotros" className="text-slate-400 hover:text-emerald-400 font-medium transition-colors">Nosotros</a>
              <a 
                href="/explorador"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              >
                Mi Portal
              </a>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-5 py-2.5 rounded-full font-semibold hover:bg-emerald-500/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Reservar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-400 hover:text-emerald-400 focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#121212] border-t border-white/10 shadow-2xl absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="#destino" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg font-medium">Destino</a>
              <a href="#experiencias" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg font-medium">Experiencias</a>
              <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg font-medium">Nosotros</a>
              <a href="/explorador" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Mi Portal (Iniciar Sesión)</a>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}
                className="mt-4 w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-600/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Reservar Aventura
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="destino" className="relative min-h-screen flex items-center justify-center pt-20">
        <Image 
          src="/serambi_cascadas_principal.jpg" 
          alt="Cascada Dos Mundos" 
          fill 
          className="object-cover opacity-60" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-block bg-teal-900 text-amber-100 px-6 py-2 rounded-full font-black text-lg md:text-xl tracking-widest mb-6 border border-amber-200/20 shadow-[0_0_20px_rgba(20,83,45,0.5)]">
            1 Y 2 DE MAYO
          </div>   
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Visita las cascadas:<br/><span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Dos Mundos Huetziatl.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-2 drop-shadow-md max-w-3xl mx-auto font-light">
            Descubre el paraíso oculto de Acaxochitlán, Hidalgo.
          </p>
          <p className="text-base md:text-lg text-emerald-300 mb-10 font-medium">
            2 Días y 1 Noche • Transporte Redondo desde CDMX y Pachuca • Comidas incluidas
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-8 py-4 rounded-full text-xl font-bold hover:bg-emerald-500/30 hover:scale-105 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center mx-auto gap-2 group"
          >
            Reservar Aventura
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── EXPERIENCIAS ── */}
      <section id="experiencias" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experiencias Inolvidables</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Dos días completos de aventura, conexión y magia natural. Cada momento diseñado para que vuelvas transformado.</p>
          </div>

          {/* Cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-all border border-white/5 hover:border-amber-500/30 group">
              <div className="relative h-64 overflow-hidden">
                <Image src="/bosque-luciernagas-.jpg" alt="Luciérnagas" fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-3 left-3"><span className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Noche Mágica</span></div>
              </div>
              <div className="p-6">
                <p className="text-xs text-amber-400 font-bold mb-1 tracking-wider">1 DE MAYO · NOCHE</p>
                <h3 className="text-xl font-bold text-white mb-2">✨ Avistamiento de Luciérnagas</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Un espectáculo único en el mundo. Miles de luciérnagas bioluminiscentes iluminan el bosque en un ballet de luz verde. Precedido por una plática educativa sobre su ciclo de vida.</p>
              </div>
            </div>

            <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-all border border-white/5 hover:border-cyan-500/30 group">
              <div className="relative h-64 overflow-hidden">
                <Image src="/Galeria6.jpeg" alt="Cascadas Dos Mundos" fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-3 left-3"><span className="bg-cyan-500/90 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Senderismo</span></div>
              </div>
              <div className="p-6">
                <p className="text-xs text-cyan-400 font-bold mb-1 tracking-wider">1 DE MAYO · TARDE</p>
                <h3 className="text-xl font-bold text-white mb-2">💧 Cascadas Dos Mundos Huetziatl</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Desciende por senderos de selva nebulosa hasta llegar a las espectaculares cascadas. Cruzarás puentes colgantes sobre baños naturales y respirarás el aire más puro de Hidalgo.</p>
              </div>
            </div>

            <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-all border border-white/5 hover:border-emerald-500/30 group">
              <div className="relative h-64 overflow-hidden">
                <Image src="/Puente.jpeg" alt="Puentes y Tirolesas" fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-3 left-3"><span className="bg-emerald-500/90 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Adrenalina</span></div>
              </div>
              <div className="p-6">
                <p className="text-xs text-emerald-400 font-bold mb-1 tracking-wider">1 DE MAYO · TARDE</p>
                <h3 className="text-xl font-bold text-white mb-2">🌉 Puentes y Tirolesas</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Siente el vértigo cruzando el cañón por largos puentes colgantes, o lánzate en las impresionantes tirolesas sobre las copas del bosque. Pura adrenalina en un ecosistema virgen.</p>
              </div>
            </div>
          </div>

          {/* Galería fotográfica */}
          <div>
            <h3 className="text-center text-xl font-bold text-white mb-6 opacity-70">El lugar, con tus propios ojos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5">
                <Image src="/galeria1.jpeg" alt="Cascada" fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
              </div>
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5 md:col-span-2">
                <Image src="/Puente.jpeg" alt="Puente Colgante" fill sizes="50vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-bold">Puente Colgante</p>
                </div>
              </div>
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5">
                <Image src="/Galeria2.jpeg" alt="Naturaleza" fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
              </div>
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5 md:col-span-2">
                <Image src="/Galeria3.jpeg" alt="Cascadas Dos Mundos" fill sizes="50vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-bold">Cascadas Dos Mundos</p>
                </div>
              </div>
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5">
                <Image src="/Galeria4.jpeg" alt="Vista" fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
              </div>
              <div className="relative h-52 rounded-xl overflow-hidden group border border-white/5">
                <Image src="/Restaurante.jpeg" alt="Restaurante La Reserva" fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <p className="text-white text-xs font-bold">Restaurante La Reserva</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ITINERARIO ── */}
      <section className="py-24 bg-[#121212]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Itinerario de la Expedición</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Cada hora planeada para que disfrutes al máximo. <span className="text-amber-400 font-semibold">Comida y desayuno incluidos</span> en tu paquete base.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* DIA 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-black text-lg border border-emerald-500/30">1 de Mayo</div>
                <div className="h-px flex-1 bg-emerald-500/20"></div>
              </div>
              <div className="space-y-3">
                {[
                  { hora: '09:00', icono: '🚌', titulo: 'Salida desde CDMX y Pachuca', desc: 'Check-in de viajeros. Se recomienda llegar 15 min antes. Salida puntual.', color: 'emerald', badge: null },
                  { hora: '12:30', icono: '🍲', titulo: 'Comida de bienvenida', desc: 'Comida caliente en el Restaurante La Reserva dentro del parque. Tu primera experiencia gastronómica de la sierra.', color: 'amber', badge: '✅ Incluida' },
                  { hora: '13:30', icono: '💧', titulo: 'Recorrido Cascadas', desc: 'Senderismo hacia las Cascadas Dos Mundos Huetziatl. Tirolesas, puentes colgantes y pozas naturales.', color: 'cyan', badge: 'Entrada incluida' },
                  { hora: '17:00', icono: '🏕️', titulo: 'Acomodo y Descanso', desc: 'Asignación de cabañas o campamento. Tiempo libre para explorar y descansar.', color: 'emerald', badge: null },
                  { hora: '19:30', icono: '✨', titulo: 'Plática + Luciérnagas', desc: 'Charla educativa de 30 min sobre el ciclo bioluminiscente. Después: el espectáculo natural más increíble de tu vida.', color: 'amber', badge: null },
                  { hora: '21:00', icono: '🎬', titulo: 'Cine "La Reserva"', desc: 'Proyección al aire libre en el área del restaurante con sillas y ambiente nocturno bajo las estrellas.', color: 'slate', badge: null },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center text-lg`}>{item.icono}</div>
                      {i < 5 && <div className="w-px h-4 bg-white/10 my-1"></div>}
                    </div>
                    <div className={`rounded-xl p-3 border flex-1 pb-3 transition-colors ${
                      item.badge === '✅ Incluida' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#0a0a0a] border-white/5 hover:border-emerald-500/20'
                    }`}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-black text-emerald-400">{item.hora}</span>
                        <span className="font-bold text-white text-sm">{item.titulo}</span>
                        {item.badge && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.badge.includes('✅') ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>{item.badge}</span>}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DIA 2 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full font-black text-lg border border-cyan-500/30">2 de Mayo</div>
                <div className="h-px flex-1 bg-cyan-500/20"></div>
              </div>
              <div className="space-y-3">
                {[
                  { hora: '08:00', icono: '☕', titulo: 'Desayuno en las Cascadas', desc: 'Desayuno completo incluido servido en el parque. El mejor despertar rodeado de naturaleza, antes de explorar los manantiales.', color: 'amber', badge: '✅ Incluido' },
                  { hora: '09:30', icono: '🦅', titulo: 'Manantiales y Aves', desc: 'Observación de aves endémicas de la sierra de Acaxochitlán. Fauna única en su ecosistema natural.', color: 'cyan', badge: null },
                  { hora: '11:00', icono: '🏡', titulo: 'Desmontaje y Foto Grupal', desc: 'Recogida de pertenencias, foto grupal de recuerdo y despedida del lugar.', color: 'slate', badge: null },
                  { hora: '14:00', icono: '🍽️', titulo: 'Buffet Tlalli', desc: 'Parada gastronómica en el Buffet Tlalli con Sabor Ancestral. Guisos tradicionales y artesanías locales.', color: 'amber', badge: 'Opcional' },
                  { hora: '14:30', icono: '🚌', titulo: 'Regreso a CDMX y Pachuca', desc: 'Salida rumbo a los puntos de encuentro. Tiempo estimado: 3–4 horas.', color: 'slate', badge: null },
                  { hora: '19:00', icono: '🏙️', titulo: 'Llegada CDMX', desc: 'Fin del servicio. ¡Gracias por vivir esta experiencia con SERAMBI!', color: 'emerald', badge: null },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center text-lg`}>{item.icono}</div>
                      {i < 5 && <div className="w-px h-4 bg-white/10 my-1"></div>}
                    </div>
                    <div className={`rounded-xl p-3 border flex-1 pb-3 transition-colors ${
                      item.badge === '✅ Incluido' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#0a0a0a] border-white/5 hover:border-cyan-500/20'
                    }`}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-black text-cyan-400">{item.hora}</span>
                        <span className="font-bold text-white text-sm">{item.titulo}</span>
                        {item.badge && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.badge.includes('✅') ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>{item.badge}</span>}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── VIDEOS TIKTOK ── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black px-4 py-2 rounded-full tracking-widest uppercase mb-4">Visto en Redes</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Mira cómo es la experiencia</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Videos reales del lugar, grabados por viajeros que ya lo vivieron. Tú eres el próximo.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { url: 'https://vt.tiktok.com/ZSHULJUTT/', label: 'Las Cascadas', emoji: '💧', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
              { url: 'https://vt.tiktok.com/ZSHU8K3Aw/', label: 'Aventura Extrema', emoji: '🎢', color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30' },
              { url: 'https://vt.tiktok.com/ZSHU8KaJD/', label: 'Senderismo', emoji: '🏞️', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
              { url: 'https://vt.tiktok.com/ZSHU8wUcx/', label: 'Luciérnagas', emoji: '✨', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
            ].map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="group relative bg-[#121212] border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col items-center justify-center p-8 gap-3"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} border ${v.border} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {v.emoji}
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-sm">{v.label}</p>
                  <p className="text-[10px] text-pink-400 font-bold mt-1 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.8a4.85 4.85 0 01-1.07-.11z"/></svg>
                    Ver en TikTok
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
          <p className="text-center text-slate-600 text-xs mt-6">Videos publicados por la comunidad. Haz clic para ver en TikTok.</p>
        </div>
      </section>

      {/* ── GASTRONOMÍA ── */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-block bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
                <span className="text-amber-400 text-sm font-bold tracking-widest uppercase">Broche de Oro</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                Buffet Tlalli<br/><span className="text-amber-500 font-serif italic text-2xl md:text-4xl drop-shadow-md">con Sabor Ancestral</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Para el viaje de regreso, haremos una parada estratégica en la entrada principal de Acaxochitlán para sumergirnos en la auténtica gastronomía reconfortante de la región.
              </p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-start">
                  <div className="bg-[#121212] p-2 rounded-lg border border-white/10 mr-4 shadow-sm">📍</div>
                  <div>
                    <h4 className="font-bold text-white">Cerca de los Arcos</h4>
                    <p className="text-sm text-slate-500">Parada fácil en Carretera México-Tuxpan.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#121212] p-2 rounded-lg border border-white/10 mr-4 shadow-sm">🍲</div>
                  <div>
                    <h4 className="font-bold text-white">Auténtico Buffet en Cazuelas</h4>
                    <p className="text-sm text-slate-500">Guisos tradicionales, barra exquisita y un ambiente sumamente acogedor bajo techos de madera y luz cálida.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#121212] p-2 rounded-lg border border-white/10 mr-4 shadow-sm">🏺</div>
                  <div>
                    <h4 className="font-bold text-white">Rincón de Artesanías</h4>
                    <p className="text-sm text-slate-500">Apoya a la comunidad y llévate un recuerdo hecho a mano por artesanos locales en su encantadora tienda integrada.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-[480px] rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <Image src="/bufette tlalli.jpg" alt="Buffet Tlalli" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><span className="text-white font-bold text-sm tracking-wide">Buffet Tlalli</span></div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <Image src="/bufette tlalli2.jpg" alt="Sabor Ancestral" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><span className="text-white font-bold text-sm tracking-wide">Sabor Ancestral</span></div>
                </div>
                <div className="relative h-52 rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <Image src="/bufette tlalli3.jpg" alt="Guisos de la Región" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"><span className="text-white font-bold text-sm tracking-wide">Guisos de la Región</span></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="nosotros" className="bg-[#050505] text-slate-400 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image 
                  src="/serambi logo(1).png" 
                  alt="SERAMBI Logo" 
                  width={120} 
                  height={40} 
                  className="object-contain h-10 w-auto brightness-0 invert opacity-80"
                />
              </div>
              <p className="text-slate-500 max-w-md leading-relaxed">
                Ecoturismo responsable y experiencias inmersivas en la naturaleza. Conectamos personas con los ecosistemas más impresionantes de México, promoviendo la conservación y el desarrollo local.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Enlaces Legales</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Aviso de Privacidad</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Políticas de Cancelación</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Información y Reservas</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-emerald-400 transition-colors flex items-center gap-2 font-mono">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">CDMX</span> 55 6239 5458
                </li>
                <li className="hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono">
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">PACHUCA</span> 77 1774 1409
                </li>
                <li className="hover:text-white transition-colors mt-6 pt-6 border-t border-white/5">contacto@serambi.mx</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} SERAMBI Ecoturismo. Todos los derechos reservados.</p>
            <p className="text-slate-500 text-xs font-medium bg-white/5 px-4 py-2 rounded-full flex items-center gap-2">
              SERAMBI es una S.A.S. legalmente constituida y marca registrada.
              <a href="/setup" className="text-slate-600 hover:text-slate-300 transition-colors" title="Configuración del Sistema">⚙️</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Pre-Registro */}
      {isModalOpen && (
        <ConstructorPaquete onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
