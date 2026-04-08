'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, CheckCircle, Leaf, X, Loader2, ArrowRight, Menu, Compass, Award, Utensils, Info, ShieldCheck, Camera, Users, Target } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import ConstructorPaquete from './components/ConstructorPaquete';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Smooth scroll functionality
  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 font-sans selection:bg-green-800/10 selection:text-green-900 overflow-x-hidden">

      {/* ── BACKGROUND DINÁMICO ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/serambi_cascadas_principal.jpg"
          alt="Región Hidro-Serrana"
          fill
          className="object-cover opacity-30 blur-2xl scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/20 via-transparent to-stone-50/20"></div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-stone-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollTo('destino')} className="flex items-center gap-2">
            <Image
              src="/serambi logo(1).png"
              alt="SERAMBI Logo"
              width={140}
              height={50}
              className="object-contain h-10 w-auto"
              priority
            />
          </button>

          <div className="hidden md:flex gap-8 items-center text-sm font-bold">
            <button onClick={() => scrollTo('destino')} className="text-stone-500 hover:text-green-800 transition-colors uppercase tracking-widest text-[10px]">Destino</button>
            <button onClick={() => scrollTo('experiencias')} className="text-stone-500 hover:text-green-800 transition-colors uppercase tracking-widest text-[10px]">Experiencias</button>
            <button onClick={() => scrollTo('itinerario')} className="text-stone-500 hover:text-green-800 transition-colors uppercase tracking-widest text-[10px]">Itinerario</button>
            <button onClick={() => scrollTo('gastronomia')} className="text-stone-500 hover:text-green-800 transition-colors uppercase tracking-widest text-[10px]">Gastronomía</button>

            <div className="h-4 w-px bg-stone-200 mx-2"></div>

            <a href="/explorador" className="bg-stone-100 text-stone-600 border border-stone-200 px-4 py-2 rounded-xl hover:bg-stone-200 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              Portal Admin
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-800 text-white px-6 py-2.5 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-800/20 uppercase tracking-widest text-[10px]"
            >
              Reservar Aventura
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-stone-900 bg-stone-100 p-2 rounded-xl border border-stone-200">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-3xl border-t border-stone-200 p-6 flex flex-col gap-4 text-sm font-black uppercase tracking-widest leading-loose">
            <button onClick={() => scrollTo('destino')} className="text-left py-3 border-b border-stone-100">Destino</button>
            <button onClick={() => scrollTo('experiencias')} className="text-left py-3 border-b border-stone-100">Experiencias</button>
            <button onClick={() => scrollTo('itinerario')} className="text-left py-3 border-b border-stone-100">Itinerario</button>
            <button onClick={() => scrollTo('gastronomia')} className="text-left py-3 border-b border-stone-100">Gastronomía</button>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }} className="bg-green-800 text-white py-4 rounded-2xl mt-2 font-black uppercase italic tracking-widest">Reservar Ahora</button>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {/* 1. HERO (IMPACTO NATURAL) */}
        <section id="destino" className="relative h-[90vh] flex items-center justify-center text-center px-4 bg-[#0a0a0a]">
          <div className="absolute inset-0 z-0">
            <Image src="/serambi_cascadas_principal.jpg" alt="Hero" fill className="object-cover opacity-60 z-0" unoptimized priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#fdfbf7] z-10"></div>
          </div>
          <div className="max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full font-black text-[10px] tracking-[0.4em] mb-8 uppercase"
            >
              EXPEDICIÓN 1 Y 2 DE MAYO
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic uppercase">
              CASCADAS <br />
              <span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">DOS MUNDOS HUETZIATL</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto font-bold mb-12 leading-relaxed italic">
              Explora un rincón impresionante de <span className="text-white underline decoration-emerald-400 decoration-4 underline-offset-8">Acaxochitlán, Hidalgo.</span>
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-12 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group uppercase tracking-tighter italic"
              >
                RESERVAR AVENTURA
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('experiencias')}
                className="bg-black/20 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-black hover:bg-white/10 transition-all uppercase tracking-tighter italic"
              >
                CONOCER MÁS
              </button>
            </div>
          </div>
        </section>

        {/* 2. GALERÍA VISUAL (MÍSTICA NOCTURNA) */}
        <section className="py-20 bg-[#0a0a0a] relative overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 z-0">
            <Image src="/serambi_cascadas_principal.jpg" alt="Nature" fill className="object-cover opacity-20 blur-sm z-0" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
              {[
                { label: 'Seguridad', title: 'Protocolos', icon: ShieldCheck, color: 'emerald', onClick: () => setShowSecurityModal(true) },
                { label: 'Galería', title: 'Realista', icon: Camera, color: 'cyan' },
                { label: 'Guías', title: 'Expertos', icon: Users, color: 'amber' },
                { label: 'Servicio', title: 'Premium', icon: Award, color: 'emerald' }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="flex flex-col items-center text-center p-6 md:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 group hover:border-emerald-500/30 transition-all shadow-2xl"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{item.label}</h3>
                  <p className="text-xs md:text-sm font-bold text-white uppercase italic leading-none">{item.title}</p>
                </button>
              ))}
            </div>

            {/* Carousel Visual Limpio */}
            <div className="flex overflow-x-auto gap-4 md:gap-6 snap-x pb-8 hide-scrollbar">
              {[
                { img: '/Puente.jpeg', title: 'SEGURIDAD', tag: 'AVENTURA' },
                { img: '/bufette tlalli2.jpg', title: 'GASTRONOMÍA', tag: 'CALIDAD' },
                { img: '/serambi_cascadas_principal.jpg', title: 'DESTINO', tag: 'NATURALEZA' },
                { img: '/Restaurante.jpeg', title: 'HOSPEDAJE', tag: 'DESCANSO' }
              ].map((item, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[40vw] snap-center aspect-[16/10] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group transition-all">
                  <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <span className="bg-emerald-500 text-black text-[8px] md:text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block italic leading-none">{item.tag}</span>
                    <h4 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. EXPERIENCIAS (DÍA/FRESCO) */}
        <section id="experiencias" className="py-24 lg:py-40 bg-[#fdfbf7] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24">
              <span className="text-emerald-700 font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">Nuestra Esencia</span>
              <h2 className="text-4xl md:text-9xl font-black text-stone-900 italic tracking-tighter leading-none uppercase">MOMENTOS <br /><span className="text-emerald-700 underline decoration-emerald-700/10">MÁGICOS</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                { title: 'Luciérnagas', subtitle: 'VISITA EDUCATIVA', img: '/bosque-luciernagas-.jpg', icon: '✨', desc: 'Conoce su ciclo de vida en su hábitat natural y presencia los primeros destellos de la temporada.' },
                { title: '10 Cascadas', subtitle: 'CIRCUITO COMPLETO', img: '/Galeria6.jpeg', icon: '🏞️', desc: 'Exploraremos 10 caídas de agua cristalina conectadas por senderos antiguos en el bosque de niebla.' },
                { title: 'Adrenalina', subtitle: 'AVENTURA EXTREMA', img: '/Puente.jpeg', icon: '🧗', desc: 'Desafía tu vértigo en tirolesas de más de 100m y cruza puentes colgantes con vistas únicas.' }
              ].map((ex, i) => (
                <div key={i} className="bg-white rounded-[40px] md:rounded-[56px] border border-stone-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                  <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
                    <Image src={ex.img} alt={ex.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-white/90 backdrop-blur-md w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-2xl border border-stone-100 shadow-xl">
                      <span className="text-xl md:text-2xl">{ex.icon}</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex-1">
                    <p className="text-stone-400 text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase mb-4">{ex.subtitle}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-stone-900 mb-6 uppercase italic tracking-tighter leading-none">{ex.title}</h3>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-8 md:mb-10 font-bold opacity-80 italic">
                      {ex.desc}
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-stone-50 border border-stone-200 text-stone-500 px-3 md:px-4 py-2 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest italic leading-none">Expedición</span>
                      <span className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 px-3 md:px-4 py-2 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest italic leading-none">Premium</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ITINERARIO (MÁXIMA OPTIMIZACIÓN) */}
        <section id="itinerario" className="py-24 bg-stone-50 border-y border-stone-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Día 1 */}
              <div className="relative rounded-[40px] md:rounded-[56px] overflow-hidden shadow-2xl transition-all hover:scale-[1.01] border border-stone-200 aspect-[4/5] md:aspect-auto min-h-[550px] md:min-h-[600px] bg-stone-100">
                <Image src="/day1_background.png" alt="Día 1" fill className="object-cover z-0" unoptimized priority />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] p-8 md:p-12 flex flex-col justify-between z-10">
                  <div className="relative z-10">
                    <span className="text-xs font-black text-emerald-400 tracking-[0.4em] uppercase mb-4 block underline decoration-emerald-500/50 underline-offset-4">Primer Gran Paso</span>
                    <h3 className="text-4xl md:text-6xl font-black text-white mb-8 md:mb-10 tracking-tighter italic uppercase leading-none">Día 1 <br /> Sábado</h3>
                    <ul className="space-y-4 md:space-y-6 text-white text-sm md:text-lg font-bold">
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">07:30</span> Salida CDMX (Copilco)8:00(21 de marzo).</li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">08:30</span> Salida Pachuca (Soriana del Valle).</li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">12:00</span> Llegada y bienvenida (snack local).</li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">13:00</span> Expedición por las 10 Cascadas.</li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">16:00</span> Comida Buffet (Restaurante del Parque).</li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">19:30</span> Santuario de Luciérnagas (Experiencia).</li>
                      <li className="flex gap-4 items-center">
                        <span className="text-emerald-400 w-12 shrink-0">21:00</span>
                        Cine VIP / Cena Buffet (Rest. Parque)
                      </li>
                      <li className="flex gap-4"><span className="text-emerald-400 w-12 shrink-0">22:30</span> Camping o Cabañas.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Día 2 */}
              <div className="relative rounded-[40px] md:rounded-[56px] overflow-hidden shadow-2xl transition-all hover:scale-[1.01] border border-stone-200 aspect-[4/5] md:aspect-auto min-h-[550px] md:min-h-[600px] bg-stone-100">
                <Image src="/day2_background.png" alt="Día 2" fill className="object-cover brightness-105 z-0" unoptimized priority />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] p-8 md:p-12 flex flex-col justify-between z-10">
                  <div className="relative z-10">
                    <span className="text-xs font-black text-emerald-800 tracking-[0.4em] uppercase mb-4 block">Conexión Final</span>
                    <h3 className="text-4xl md:text-6xl font-black text-stone-900 mb-8 md:mb-10 tracking-tighter italic uppercase leading-none">Día 2 <br /> Domingo</h3>
                    <ul className="space-y-4 md:space-y-6 text-stone-800 text-sm md:text-lg font-bold">
                      <li className="flex gap-4"><span className="text-emerald-700 w-12 shrink-0">09:00</span> Desayuno Bufette Tradicional.</li>
                      <li className="flex gap-4"><span className="text-emerald-700 w-12 shrink-0">10:30</span> Puentes,Tirolesas +100m y Senderismo.</li>
                      <li className="flex gap-4"><span className="text-emerald-700 w-12 shrink-0">14:00</span> Gran Buffet de Clausura.</li>
                      <li className="flex gap-4 opacity-40"><span className="text-emerald-700 w-12 shrink-0">16:00</span> Regreso a puntos de origen.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. VINCULACIÓN SOCIAL (NOCHE/VIBRA) */}
        <section className="py-24 lg:py-44 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="mb-20">
              <span className="text-pink-500/60 font-black text-[10px] tracking-[0.6em] uppercase mb-6 block leading-none">Visto en Redes</span>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">LA AVENTURA <br /> <span className="text-pink-500 underline decoration-pink-500/20">EN CÁMARA</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
              {[
                { url: 'https://vt.tiktok.com/ZSHULJUTT/', label: 'Cascadas', icon: '🏞️' },
                { url: 'https://vt.tiktok.com/ZSHU8K3Aw/', label: 'Vértigo', icon: '🧗🏼' },
                { url: 'https://vt.tiktok.com/ZSHU8KaJD/', label: 'Bosque', icon: '🏕️' },
                { url: 'https://vt.tiktok.com/ZSHU8wUcx/', label: 'Conexión', icon: '✨' },
              ].map((v, i) => (
                <a key={i} href={v.url} target="_blank" className="bg-white/5 border border-white/10 p-8 md:p-14 rounded-[40px] md:rounded-[64px] flex flex-col items-center justify-center gap-4 md:gap-6 hover:scale-105 hover:border-pink-500/30 hover:bg-white/10 transition-all group shadow-2xl">
                  <div className="text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-500">{v.icon}</div>
                  <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{v.label}</span>
                  <div className="h-px w-8 bg-pink-500/20 group-hover:w-16 transition-all"></div>
                  <span className="text-[10px] text-pink-500 font-black tracking-[0.3em] uppercase italic italic tracking-tighter">Explorar</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 6. GASTRONOMÍA (NOCHE/CÁLIDO) */}
        <section id="gastronomia" className="py-24 lg:py-48 relative overflow-hidden bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-8 md:space-y-12">
              <Compass className="text-amber-500 w-12 h-12 md:w-20 md:h-20 opacity-20" />
              <h2 className="text-5xl md:text-[8rem] xl:text-[10rem] font-black text-white tracking-tighter italic uppercase leading-[0.8] mb-8 leading-none">SABOR <br className="hidden lg:block" /> ANCESTRAL</h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-bold opacity-80 max-w-xl">
                Honramos la receta tradicional de la sierra. El Buffet Tlalli será el broche de oro tras una jornada de exploración profunda.
              </p>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] md:rounded-[64px] p-8 md:p-12 shadow-2xl max-w-xl">
                <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="bg-amber-500/10 text-amber-500 px-5 md:px-6 py-2 rounded-2xl text-[9px] md:text-[10px] font-black uppercase italic tracking-widest border border-amber-500/20">Cazuelas Calientes</span>
                  <span className="bg-white/5 text-slate-400 px-5 md:px-6 py-2 rounded-2xl text-[9px] md:text-[10px] font-black uppercase italic tracking-widest border border-white/5">Hecho a Mano</span>
                </div>
                <p className="text-slate-200 font-bold text-xl md:text-2xl leading-none underline decoration-amber-500/20 underline-offset-8 decoration-2 italic mb-2 tracking-tighter leading-tight">
                  "Un festín diseñado para compartir las historias de la jornada."
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 p-6 md:p-10 bg-white/5 rounded-[50px] md:rounded-[80px] border border-white/10 shadow-inner">
              <div className="relative h-[400px] md:h-[650px] rounded-[32px] md:rounded-[64px] overflow-hidden shadow-2xl group border border-white/10">
                <Image src="/bufette_tlalli.jpg" alt="Buffet" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="grid gap-4 md:gap-8 mt-12 md:mt-24">
                <div className="relative h-56 md:h-80 rounded-[24px] md:rounded-[56px] overflow-hidden shadow-2xl group border border-white/10">
                  <Image src="/bufette_tlalli2.jpg" alt="Tradición" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="relative h-48 md:h-72 rounded-[24px] md:rounded-[56px] overflow-hidden shadow-2xl group border border-white/10">
                  <Image src="/bufette_tlalli3.jpg" alt="Sabor" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-6 bg-stone-900 text-stone-100 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center md:items-start gap-6">
            <button onClick={() => scrollTo('destino')} className="flex justify-center w-full md:w-auto">
              <Image src="/serambi logo(1).png" alt="Logo" width={200} height={60} className="brightness-0 invert opacity-60 hover:opacity-100 transition-opacity" />
            </button>
            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em] leading-relaxed text-center md:text-left italic max-w-[250px]">
              Ecoturismo de Aventura • Acaxochitlán, Hidalgo.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 text-[10px] font-black text-stone-400 uppercase tracking-widest items-center md:justify-end">
            <a href="/explorador" className="hover:text-green-400 bg-white/5 px-10 py-5 rounded-full border border-white/5 transition-all flex items-center gap-3 group">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Acceso Staff
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center">
          <span className="text-[11px] font-black text-stone-600 uppercase tracking-[0.6em]">2026 © SERAMBI EXPEDITIONS — NATURALEZA Y AVENTURA</span>
        </div>
      </footer>

      {showSecurityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[56px] border border-stone-200 p-10 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 z-10">
              <button onClick={() => setShowSecurityModal(false)} className="p-3 text-stone-400 hover:text-stone-900 bg-stone-100 rounded-2xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-green-100">
                <ShieldCheck className="w-10 h-10 text-green-800" />
              </div>
              <h3 className="text-3xl font-black text-stone-900 uppercase italic tracking-tighter leading-none mb-2">Protocolos de <br /> Seguridad</h3>
              <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Nuestra prioridad número uno</p>
            </div>
            <div className="space-y-8">
              {[
                { title: 'EQUIPO CERTIFICADO', desc: 'Arneses y cuerdas con certificación internacional UIAA/CE.', icon: '🛡️' },
                { title: 'GUÍAS PROFESIONALES', desc: 'Expertos en rescate vertical y primeros auxilios.', icon: '🎓' },
                { title: 'SEGURO DE VIAJERO', desc: 'Cobertura médica incluida en todas las expediciones.', icon: '📝' },
                { title: 'GRUPOS REDUCIDOS', desc: 'Atención personalizada y protocolos de higiene.', icon: '✨' }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="text-2xl mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-stone-900 font-black text-xs tracking-widest uppercase mb-1">{item.title}</h4>
                    <p className="text-stone-500 text-xs leading-relaxed italic font-bold opacity-70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowSecurityModal(false)} className="w-full bg-green-800 text-white py-5 rounded-[28px] mt-12 font-black uppercase italic tracking-widest shadow-xl shadow-green-900/20">Entendido</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ConstructorPaquete onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
