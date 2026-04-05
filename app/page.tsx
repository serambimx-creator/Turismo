'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, CheckCircle, Leaf, X, Loader2, ArrowRight, Menu, Compass, Award, Utensils, Info, ShieldCheck, Camera, Users, Target } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import ConstructorPaquete from './components/ConstructorPaquete';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll functionality
  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      
      {/* ── BACKGROUND DINÁMICO PREMIUM ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image 
          src="/serambi_cascadas_principal.jpg" 
          alt="Región Hidro-Serrana" 
          fill 
          className="object-cover opacity-30 blur-2xl scale-105" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/20 to-[#0a0a0a]"></div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-2xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollTo('destino')} className="flex items-center gap-2">
            <Image 
              src="/serambi logo(1).png" 
              alt="SERAMBI Logo" 
              width={100} 
              height={30} 
              className="object-contain h-8 w-auto brightness-0 invert"
              priority
            />
          </button>
          
          <div className="hidden md:flex gap-8 items-center text-sm font-bold">
            <button onClick={() => scrollTo('destino')} className="text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Destino</button>
            <button onClick={() => scrollTo('experiencias')} className="text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Experiencias</button>
            <button onClick={() => scrollTo('itinerario')} className="text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Itinerario</button>
            <button onClick={() => scrollTo('gastronomia')} className="text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Gastronomía</button>
            
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            
            <a href="/explorador" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl hover:bg-cyan-500/20 transition-all flex items-center gap-2">
              <Users className="w-4 h-4" />
              Portal Admin
            </a>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/40"
            >
              Reservar
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-3xl border-t border-white/10 p-6 flex flex-col gap-4 text-sm font-black uppercase tracking-widest leading-loose">
            <button onClick={() => scrollTo('destino')} className="text-left py-3 border-b border-white/5">Destino</button>
            <button onClick={() => scrollTo('experiencias')} className="text-left py-3 border-b border-white/5">Experiencias</button>
            <button onClick={() => scrollTo('itinerario')} className="text-left py-3 border-b border-white/5">Itinerario</button>
            <button onClick={() => scrollTo('gastronomia')} className="text-left py-3 border-b border-white/5">Gastronomía</button>
            <a href="/explorador" className="text-cyan-400 py-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Acceso Admin
            </a>
            <button onClick={() => {setIsMobileMenuOpen(false); setIsModalOpen(true);}} className="bg-emerald-500 text-black py-4 rounded-2xl mt-2 font-black uppercase italic">Reservar Aventura</button>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-20">
        {/* 1. HERO */}
        <section id="destino" className="relative h-[85vh] flex items-center justify-center text-center px-4">
          <div className="max-w-5xl bg-black/20 backdrop-blur-sm p-8 md:p-12 rounded-[40px] border border-white/5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-block bg-teal-900/40 border border-teal-500/30 text-emerald-100 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.4em] mb-8 uppercase backdrop-blur-xl"
            >
              EXPEDICIÓN 1 Y 2 DE MAYO
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
              LAS CASCADAS <br/>
              <span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] font-black">DOS MUNDOS</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-bold mb-12 leading-relaxed">
              Explora el rincón más virgen de <span className="text-white underline decoration-emerald-500 decoration-4 underline-offset-8">Acaxochitlán, Hidalgo.</span>
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-12 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group"
              >
                RESERVAR AHORA
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => scrollTo('experiencias')}
                className="bg-black/40 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-black hover:bg-white/10 transition-all uppercase tracking-tighter"
              >
                EXPLORAR
              </button>
            </div>
          </div>
        </section>

        {/* 2. GALERÍA DE CONFIANZA */}
        <section className="py-20 bg-white/5 backdrop-blur-3xl border-y border-white/10 shadow-inner">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl group hover:bg-emerald-500/5 transition-all">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-emerald-500 w-7 h-7" />
                </div>
                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-widest italic">Seguridad</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Equipos Certificados</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl group hover:bg-cyan-500/5 transition-all">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Camera className="text-cyan-500 w-7 h-7" />
                </div>
                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-widest italic">Fotos Reales</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Cero Placeholders</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl group hover:bg-amber-500/5 transition-all">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Users className="text-amber-500 w-7 h-7" />
                </div>
                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-widest italic">Guías</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Expertos Locales</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-xl group hover:bg-emerald-500/5 transition-all">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Award className="text-emerald-500 w-7 h-7" />
                </div>
                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-widest italic">Premium</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Servicio VIP</p>
              </div>
            </div>

            {/* Carousel Visual */}
            <div className="mt-20 flex overflow-x-auto gap-6 snap-x pb-8 hide-scrollbar">
              {[
                {img: '/Puente.jpeg', title: 'Seguridad Certificada', tag: 'Aventura'},
                {img: '/bufette tlalli2.jpg', title: 'Comida de la Sierra', tag: 'Calidad'},
                {img: '/bosque-luciernagas-.jpg', title: 'Bosques Vírgenes', tag: 'Destino'},
                {img: '/Restaurante.jpeg', title: 'Hospedaje Cómodo', tag: 'Hospedaje'}
              ].map((item, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[40vw] snap-center aspect-video relative rounded-[40px] overflow-hidden border border-white/20 shadow-2xl group transition-all">
                  <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                    <span className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-4 inline-block italic shadow-xl">{item.tag}</span>
                    <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-none">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. EXPERIENCIAS */}
        <section id="experiencias" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">MOMENTOS <span className="text-emerald-500">MÁGICOS</span></h2>
              <p className="text-slate-400 mt-6 text-xl font-bold uppercase tracking-widest opacity-50">Diseñados para transformar tu visión</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { title: 'Luciérnagas', subtitle: 'BIOLUMINISCENCIA', img: '/bosque-luciernagas-.jpg', color: 'amber', icon: '✨' },
                { title: 'Dos Mundos', subtitle: 'AVENTURA HIDRO', img: '/Galeria6.jpeg', color: 'cyan', icon: '💧' },
                { title: 'Puentes y Tiros', subtitle: 'PURA ADRENALINA', img: '/Puente.jpeg', color: 'emerald', icon: '🌉' }
              ].map((ex, i) => (
                <div key={i} className="bg-black/40 backdrop-blur-3xl rounded-[48px] border border-white/10 overflow-hidden shadow-2xl group">
                   <div className="relative h-80 w-full overflow-hidden">
                      <Image src={ex.img} alt={ex.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-2xl border border-white/20">
                        <span className="text-2xl">{ex.icon}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                   </div>
                   <div className="p-10">
                     <p className={`text-${ex.color}-400 text-xs font-black tracking-[0.3em] uppercase mb-4`}>{ex.subtitle}</p>
                     <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">{ex.title}</h3>
                     <p className="text-slate-400 text-base leading-relaxed mb-8 font-bold opacity-80">
                        {i === 0 ? 'Miles de luciérnagas iluminan el bosque en un ballet ancestral único bajo la luna de mayo.' : 
                         i === 1 ? 'Descenso a las majestuosas cascadas rodeadas de la selva nebulosa más pura de Hidalgo.' : 
                         'Siente el vértigo cruzando el cañón por puentes colgantes sobre el dosel del bosque.'}
                     </p>
                     <div className="flex gap-3">
                        <span className="bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Naturaleza</span>
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Aventura</span>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ITINERARIO */}
        <section id="itinerario" className="py-20 lg:py-32 bg-emerald-500/5 backdrop-blur-xl border-y border-white/5 shadow-2xl">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-6">EL PLAN <span className="text-emerald-500 underline decoration-8 underline-offset-8">PERFECTO</span></h2>
              <p className="text-emerald-400 font-black text-xs tracking-[0.4em] uppercase font-mono">Bitácora de Expedición / 48 Horas</p>
            </div>
            <div className="space-y-10">
              {[
                { h: '09:00', t: 'Punto de Encuentro', icon: '🚌', desc: 'Salida puntual desde CDMX y Pachuca con check-in de seguridad.' },
                { h: '12:30', t: 'Bienvenida Gastronómica', icon: '🍱', desc: 'Comida caliente incluida para recargar energías antes de la travesía.', inc: true },
                { h: '14:00', t: 'Expedición Cascadas', icon: '💧', desc: 'Actividades de montaña, tirolesas y nado en pozas naturales.' },
                { h: '19:30', t: 'Noche de Luciérnagas', icon: '✨', desc: 'Plática educativa y avistamiento del espectáculo bioluminiscente.' },
                { h: '08:00', t: 'Desayuno Montañero', icon: '☕', desc: 'Amanecer con café de olla y desayuno completo incluido.', inc: true },
              ].map((step, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="shrink-0 flex flex-col items-center pt-2">
                    <span className="font-mono text-sm font-black text-emerald-400 tracking-tighter opacity-70 mb-2">{step.h}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <div className="w-px h-24 bg-gradient-to-b from-emerald-500/40 to-transparent mt-2"></div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-3xl border border-white/10 px-10 py-8 rounded-[40px] flex-1 group-hover:bg-white/5 group-hover:-translate-y-2 transition-all shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">{step.icon}</div>
                       <h4 className="font-black text-white text-xl uppercase tracking-tighter italic">{step.t}</h4>
                       {step.inc && <span className="text-[10px] font-black bg-amber-500 text-black px-3 py-1 rounded-full shadow-lg shadow-amber-500/20">INCLUIDO ✓</span>}
                    </div>
                    <p className="text-slate-400 text-base font-bold leading-relaxed opacity-60 italic">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. VIDEOS / TIKTOK */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 text-center">
             <div className="mb-16">
               <span className="text-pink-500 font-black text-xs tracking-[0.5em] uppercase mb-4 block">Visto en Redes</span>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">VÍVELO ANTES <br/> <span className="text-pink-500 underline decoration-pink-500/30">DE IR</span></h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               {[
                 { url: 'https://vt.tiktok.com/ZSHULJUTT/', label: 'Cascadas', icon: '💧' },
                 { url: 'https://vt.tiktok.com/ZSHU8K3Aw/', label: 'Vértigo', icon: '🎡' },
                 { url: 'https://vt.tiktok.com/ZSHU8KaJD/', label: 'Bosque', icon: '🏞️' },
                 { url: 'https://vt.tiktok.com/ZSHU8wUcx/', label: 'Misticismo', icon: '✨' },
               ].map((v, i) => (
                 <a key={i} href={v.url} target="_blank" className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[48px] flex flex-col items-center justify-center gap-6 hover:scale-105 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group shadow-2xl">
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{v.icon}</div>
                    <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{v.label}</span>
                    <div className="h-px w-8 bg-pink-500/30 group-hover:w-16 transition-all"></div>
                    <span className="text-[10px] text-pink-500 font-black tracking-widest uppercase italic">Xperience</span>
                 </a>
               ))}
             </div>
          </div>
        </section>

        {/* 6. GASTRONOMÍA */}
        <section id="gastronomia" className="py-20 lg:py-32 relative overflow-hidden bg-black/40 backdrop-blur-2xl border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Award className="text-amber-500 w-20 h-20 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
              <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-[0.8] mb-4">SABOR <br className="hidden lg:block"/> ANCESTRAL</h2>
              <p className="text-slate-400 text-xl leading-relaxed font-bold opacity-60">
                Honramos la receta tradicional de la sierra en cada bocado. El Buffet Tlalli será el broche de oro tras la expedición.
              </p>
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 flex flex-col gap-6">
                <div className="flex flex-wrap gap-4">
                  <span className="bg-amber-500/20 text-amber-500 px-5 py-2 rounded-2xl text-xs font-black uppercase italic border border-amber-500/30">Cazuelas Calientes</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-2xl text-xs font-black uppercase italic border border-emerald-500/30">Hecho a Mano</span>
                  <span className="bg-cyan-500/20 text-cyan-400 px-5 py-2 rounded-2xl text-xs font-black uppercase italic border border-cyan-500/30">Ingredientes Locales</span>
                </div>
                <p className="text-slate-200 font-bold text-lg leading-snug underline decoration-amber-500/30 underline-offset-4 decoration-2 italic">
                  Un festín bajo luz cálida diseñado para compartir las historias de la jornada.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-[60px] border border-white/10 backdrop-blur-md">
              <div className="relative h-[500px] rounded-[48px] overflow-hidden border border-white/20 shadow-2xl group">
                <Image src="/bufette tlalli.jpg" alt="Buffet" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="grid gap-6 mt-16">
                <div className="relative h-64 rounded-[40px] overflow-hidden border border-white/20 shadow-2xl group">
                  <Image src="/bufette tlalli2.jpg" alt="Tradición" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="relative h-56 rounded-[40px] overflow-hidden border border-white/20 shadow-2xl group">
                  <Image src="/bufette tlalli3.jpg" alt="Sabor" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 bg-[#0a0a0a] border-t border-white/10 relative z-10 shadow-inner">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 justify-between items-center gap-12">
           <div className="flex flex-col items-center md:items-start gap-6">
              <button onClick={() => scrollTo('destino')}>
                <Image src="/serambi logo(1).png" alt="Logo" width={180} height={50} className="brightness-0 invert opacity-40 hover:opacity-100 transition-opacity" />
              </button>
              <p className="text-sm text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed text-center md:text-left italic">
                Ecoturismo de Aventura <br/> Acaxochitlán, Hidalgo.
              </p>
           </div>
           <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-sm font-black text-slate-500 uppercase tracking-widest items-center md:justify-end">
              <a href="/explorador" className="hover:text-cyan-400 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 transition-all flex items-center gap-2 group">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Portal Staff
              </a>
              <a href="/setup" className="hover:text-amber-400 italic text-[10px] opacity-50">Configuración</a>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">2026 © SERAMBI EXPEDITIONS — PREMIUM OUTDOORS</span>
        </div>
      </footer>

      {isModalOpen && (
        <ConstructorPaquete onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
