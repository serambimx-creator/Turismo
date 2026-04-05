'use client';

import { useState } from 'react';
import { MapPin, Calendar, CheckCircle, Leaf, X, Loader2, ArrowRight, Menu, Compass, Award, Utensils, Info } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import ConstructorPaquete from './components/ConstructorPaquete';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: Info, color: 'emerald' },
  { id: 'experiencias', label: 'Experiencias', icon: Compass, color: 'cyan' },
  { id: 'itinerario', label: 'Itinerario', icon: Calendar, color: 'amber' },
  { id: 'gastronomia', label: 'Gastronomía', icon: Utensils, color: 'orange' },
];

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      
      {/* ── BACKGROUNDS DINÁMICOS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image 
          src={activeTab === 'gastronomia' ? '/bufette tlalli.jpg' : '/serambi_cascadas_principal.jpg'} 
          alt="Región Hidro-Serrana" 
          fill 
          className="object-cover opacity-20 blur-2xl transition-all duration-1000 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
      </div>

      {/* ── NAVBAR (MINIMALISTA) ── */}
      <nav className="fixed w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
            <Image 
              src="/serambi logo(1).png" 
              alt="SERAMBI Logo" 
              width={100} 
              height={30} 
              className="object-contain h-8 w-auto brightness-0 invert"
              priority
            />
          </div>
          
          <div className="hidden md:flex gap-4 p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <a href="/explorador" className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Mi Portal</a>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-black px-6 py-2.5 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Reservar
          </button>
        </div>
      </nav>

      {/* ── MOBILE TAB BAR (FIJO ABAJO) ── */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[60]">
        <div className="bg-[#121212]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-2.5 shadow-2xl flex justify-between">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all flex-1 ${
                activeTab === tab.id ? 'bg-emerald-500 text-black' : 'text-slate-500'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL (GLASSMORPHISM) ── */}
      <main className="relative z-10 pt-28 pb-32 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
          
          <AnimatePresence mode="wait">
            {activeTab === 'inicio' && (
              <motion.div 
                key="inicio"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center py-12"
              >
                <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-2 rounded-full font-black text-sm tracking-widest mb-8 uppercase backdrop-blur-md">
                  1 y 2 de mayo de 2026
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.05] mb-8 tracking-tighter">
                  EXPEDICIÓN <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x drop-shadow-2xl">
                    HUETZIATL
                  </span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-300 max-w-2xl font-medium leading-relaxed mb-12">
                  Más que un viaje, una inmersión en el corazón vibrante de la sierra hidalguense. Dos días de aventura pura y conexión profunda.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-3xl mb-12">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col items-center">
                    <span className="text-3xl mb-2">🚌</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transporte</span>
                    <span className="text-sm font-black text-white">Redondo Incluido</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col items-center">
                    <span className="text-3xl mb-2">🏘️</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospedaje</span>
                    <span className="text-sm font-black text-white">Opción Cabaña</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col items-center col-span-2 md:col-span-1">
                    <span className="text-3xl mb-2">🍱</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gastronomía</span>
                    <span className="text-sm font-black text-white">2 Comidas Reales</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black px-12 py-5 rounded-3xl text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 group"
                >
                  RESERVAR MI LUGAR
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            )}

            {activeTab === 'experiencias' && (
              <motion.div 
                key="experiencias"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter">EL PARAÍSO <span className="text-emerald-500 underline underline-offset-8">OCULTO</span></h2>
                  <p className="text-slate-400 font-medium">Desliza para explorar la aventura</p>
                </div>

                <div className="flex overflow-x-auto pb-8 gap-4 snap-x hide-scrollbar px-4 -mx-4 md:px-0 md:mx-0 md:grid md:grid-cols-3">
                  {[
                    { title: 'Bioluminiscencia', subtitle: 'LUCIÉRNAGAS', img: '/bosque-luciernagas-.jpg', color: 'amber', icon: '✨' },
                    { title: 'Caída de Agua', subtitle: 'DOS MUNDOS', img: '/Galeria6.jpeg', color: 'cyan', icon: '💧' },
                    { title: 'Puentes y Vértigo', subtitle: 'ADRENALINA', img: '/Puente.jpeg', color: 'emerald', icon: '🌉' }
                  ].map((ex, i) => (
                    <div key={i} className="min-w-[85vw] md:min-w-0 snap-center bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                      <div className="relative h-64 w-full">
                        <Image src={ex.img} alt={ex.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                          <span className="text-lg">{ex.icon}</span>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className={`text-${ex.color}-400 text-xs font-black tracking-widest uppercase mb-1`}>{ex.subtitle}</p>
                        <h3 className="text-2xl font-black text-white mb-4">{ex.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                          {i === 0 ? 'Miles de luciérnagas iluminan el bosque en un espectáculo único bajo la luna de mayo.' : 
                           i === 1 ? 'Dos cascadas majestuosas que nacen de manantiales vírgenes entre la selva nebulosa.' : 
                           'Siente el aire cruzando puentes colgantes sobre el cañón de Acaxochitlán.'}
                        </p>
                        <div className="flex gap-2">
                          <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider italic">Naturaleza Pura</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'itinerario' && (
              <motion.div 
                key="itinerario"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 p-8 shadow-2xl">
                  <h3 className="text-3xl font-black text-white mb-8 text-center italic">TRAVESÍA 48 HORAS</h3>
                  <div className="space-y-6">
                    {[
                      { h: '09:00', t: 'Salida CDMX/Pachuca', icon: '🚌', type: 'DÍA 1' },
                      { h: '12:30', t: 'Comida La Reserva', icon: '🍱', type: 'DÍA 1', inc: true },
                      { h: '14:00', t: 'Exploración Cascadas', icon: '💧', type: 'DÍA 1' },
                      { h: '19:30', t: 'Santuario Luciérnagas', icon: '✨', type: 'DÍA 1' },
                      { h: '08:00', t: 'Desayuno Montañero', icon: '☕', type: 'DÍA 2', inc: true },
                      { h: '14:00', t: 'Buffet Tlalli', icon: '🥘', type: 'DÍA 2' },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6 items-center group">
                        <div className="shrink-0 flex flex-col items-center">
                          <span className="font-black text-xs text-emerald-400 font-mono tracking-widest">{step.h}</span>
                          <div className={`w-3 h-3 rounded-full border-2 ${step.type === 'DÍA 1' ? 'border-emerald-500' : 'border-cyan-500'} mt-1`}></div>
                        </div>
                        <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl flex-1 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{step.icon}</span>
                            <span className="font-bold text-white text-sm">{step.t} {step.inc && <span className="text-amber-400 text-[10px] ml-1">✓ INCLUIDO</span>}</span>
                          </div>
                          <span className="text-[10px] text-white/30 font-black">{step.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gastronomia' && (
              <motion.div 
                key="gastronomia"
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <Award className="text-emerald-500 w-16 h-16" />
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">Sabor <br/> Ancestral</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    No solo alimentamos el cuerpo, honramos la tradición de la sierra de Acaxochitlán en cada bocado.
                  </p>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <h4 className="font-black text-white uppercase text-xs mb-4 tracking-widest">El gran final</h4>
                    <p className="text-slate-300 font-medium">El Buffet Tlalli nos espera en el regreso con guisos en cazuela y tortillas hechas a mano. </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10">
                    <Image src="/bufette tlalli.jpg" alt="Buffet" fill className="object-cover" />
                  </div>
                  <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10 mt-12">
                    <Image src="/bufette tlalli2.jpg" alt="Tlalli" fill className="object-cover" />
                  </div>
                  <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10 -mt-12 col-span-2">
                    <Image src="/bufette tlalli3.jpg" alt="Tradición" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-black text-xl tracking-[1em] opacity-50 uppercase">Artesanía</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <Image src="/serambi logo(1).png" alt="Logo" width={80} height={20} className="brightness-0 invert" />
            <span className="text-xs font-medium">© 2026 SERAMBI EXPEDITIONS</span>
          </div>
          <div className="flex gap-4">
            <a href="/explorador" className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Portal</a>
            <a href="/setup" className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic">Admin Setup</a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <ConstructorPaquete onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
