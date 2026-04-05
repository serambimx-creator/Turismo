'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Bell, MapPin, Navigation, ChevronDown, ChevronUp, MessageSquare, X, Send, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { GoogleGenAI } from '@google/genai';

export default function ExploradorPortal() {
  const params = useParams();
  const whatsapp = params.whatsapp as string;
  const [asistente, setAsistente] = useState<any>(null);
  const [errorPortal, setErrorPortal] = useState<string | null>(null);
  const [avisos, setAvisos] = useState<any[]>([]);
  const [hasNewAviso, setHasNewAviso] = useState(false);
  const [showAvisos, setShowAvisos] = useState(false);
  const [logistica, setLogistica] = useState<any[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!whatsapp) return;

    const fetchData = async () => {
      try {
        const supabase = getSupabase();
        console.log('Portal: Iniciando carga para', whatsapp);
        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from('asistentes')
          .select('*')
          .eq('whatsapp', whatsapp)
          .single();

        if (userError) {
          console.error("Error de Supabase al buscar usuario:", userError);
          setErrorPortal("No pudimos encontrar tu perfil en la base de datos.");
          return;
        }

        if (!userData) {
          console.error("Usuario no encontrado");
          setErrorPortal("Perfil no encontrado.");
          return;
        }

        if (!userData.acceso_validado) {
          console.warn("Acceso no validado para:", whatsapp);
          setErrorPortal("Tu acceso aún no ha sido validado por el equipo.");
          return;
        }

        console.log('Portal: Usuario cargado con éxito:', userData.nombre_completo);
        setAsistente(userData);

        // Fetch avisos
        const { data: avisosData, error: avisosError } = await supabase
          .from('avisos_vivo')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (avisosData && avisosData.length > 0) {
          setAvisos(avisosData);
        } else {
          // Mock avisos if empty or error
          setAvisos([
            { id: 1, mensaje: 'Recuerden llevar impermeable, hay probabilidad de lluvia ligera en la tarde.', urgencia: 'Media', timestamp: new Date().toISOString() },
            { id: 2, mensaje: 'El punto de reunión ha cambiado ligeramente. Revisen la ubicación actualizada.', urgencia: 'Alta', timestamp: new Date(Date.now() - 3600000).toISOString() }
          ]);
        }

        // Fetch logistica
        const { data: logisticaData, error: logisticaError } = await supabase
          .from('logistica_viaje')
          .select('*')
          .order('hora', { ascending: true });
          
        if (logisticaData && logisticaData.length > 0) {
          setLogistica(logisticaData);
        } else {
          // Mock logistica if empty or error
          setLogistica([
            { id: 1, hora: '08:00 AM', actividad: 'Punto de Encuentro CDMX', enlace_maps_waze: 'https://maps.google.com' },
            { id: 2, hora: '11:00 AM', actividad: 'Llegada a Cabañas', enlace_maps_waze: 'https://maps.google.com' },
            { id: 3, hora: '12:30 PM', actividad: 'Inicio Ruta de Cascadas', enlace_maps_waze: 'https://maps.google.com' }
          ]);
        }
      } catch (err) {
        console.error("Error inesperado en portal:", err);
        setErrorPortal("Ocurrió un error inesperado al cargar el portal.");
      }
    };

    fetchData();
    
    const supabase = getSupabase();
    // Real-time subscription for avisos
    const channel = supabase
      .channel('avisos_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avisos_vivo' }, (payload) => {
        setAvisos(prev => [payload.new, ...prev]);
        setHasNewAviso(true);
      })
      .subscribe();

    return () => {
      getSupabase().removeChannel(channel);
    };
  }, [whatsapp, router]);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      // Build conversation history
      const history = chatMessages.map(msg => msg.content).join('\n');
      const prompt = `Historial:\n${history}\n\nUsuario: ${userMsg}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'Eres un asistente experto en biología y ecología de SERAMBI. Ayudas a los viajeros con dudas sobre el recorrido a las Cascadas Dos Mundos, su flora, fauna (luciérnagas, colibríes) y recomendaciones de clima. Responde de manera concisa y amigable.',
        }
      });

      if (response.text) {
        const textContent = response.text;
        setChatMessages(prev => [...prev, { role: 'assistant', content: textContent }]);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema de conexión. ¿Puedes intentar de nuevo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (errorPortal) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        <h2 className="text-xl font-bold text-slate-200 mb-2">Error en el Portal</h2>
        <p className="text-slate-400 mb-6">{errorPortal}</p>
        <button 
          onClick={() => router.push('/explorador')}
          className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-6 py-2 rounded-xl font-bold hover:bg-emerald-600/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          Volver al Login
        </button>
      </div>
    );
  }

  if (!asistente) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans pb-24 relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <header className="bg-[#121212] border-b border-slate-800 p-4 sticky top-0 z-20 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Portal Explorador</h1>
          <p className="text-xs text-slate-400 font-medium">Hola, {asistente.nombre_completo}</p>
        </div>
        <button 
          onClick={() => { setShowAvisos(true); setHasNewAviso(false); }}
          className="relative p-2 bg-slate-800/50 rounded-full hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <Bell className="w-6 h-6 text-slate-300" />
          {hasNewAviso && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          )}
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6 mt-4">
        {/* Welcome Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
          <h2 className="text-2xl font-bold mb-2 text-slate-100">Bienvenido a la expedición</h2>
          <p className="text-emerald-400/80 text-sm">Tu lugar está confirmado. Prepárate para descubrir las Cascadas Dos Mundos.</p>
        </div>

        {/* Geolocation Card */}
        <div className="bg-[#121212] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center text-slate-200">
            <MapPin className="w-5 h-5 mr-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" /> Puntos de Encuentro
          </h3>
          <div className="space-y-3">
            {logistica.filter(l => l.enlace_maps_waze).map((item) => (
              <a 
                key={item.id}
                href={item.enlace_maps_waze}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-cyan-600/20 text-cyan-400 p-4 rounded-xl border border-cyan-500/50 hover:bg-cyan-500/30 hover:scale-[1.02] shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all font-bold group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm drop-shadow-md">{item.actividad}</span>
                  <span className="text-xs text-cyan-300/80 font-normal mt-0.5">{item.hora}</span>
                </div>
                <div className="flex items-center bg-[#0a0a0a]/50 px-3 py-2 rounded-lg border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-colors">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span className="text-xs">Abrir App</span>
                </div>
              </a>
            ))}
            {logistica.filter(l => l.enlace_maps_waze).length === 0 && (
              <p className="text-sm text-slate-500">Aún no hay ubicaciones disponibles.</p>
            )}
          </div>
        </div>

        {/* Context Cards (Accordion) */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-200 ml-2">Información del Ecosistema</h3>
          
          <div className="bg-[#121212] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion('biologia')}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-300 hover:bg-[#1a1a1a] transition-colors"
            >
              Contexto Biológico
              {openAccordion === 'biologia' ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {openAccordion === 'biologia' && (
              <div className="p-4 pt-0 text-sm text-slate-400 border-t border-slate-800 bg-[#0a0a0a]">
                Acaxochitlán es un bosque mesófilo de montaña, hogar de especies endémicas. Durante la noche, podremos observar luciérnagas si las condiciones de humedad son óptimas.
              </div>
            )}
          </div>

          <div className="bg-[#121212] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion('geologia')}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-300 hover:bg-[#1a1a1a] transition-colors"
            >
              Geología de Dos Mundos
              {openAccordion === 'geologia' ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {openAccordion === 'geologia' && (
              <div className="p-4 pt-0 text-sm text-slate-400 border-t border-slate-800 bg-[#0a0a0a]">
                Las cascadas se forman por fallas geológicas antiguas. El agua rica en minerales crea formaciones rocosas únicas a lo largo de los siglos.
              </div>
            )}
          </div>

          <div className="bg-[#121212] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleAccordion('reglas')}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-300 hover:bg-[#1a1a1a] transition-colors"
            >
              Reglas y Equipo
              {openAccordion === 'reglas' ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {openAccordion === 'reglas' && (
              <div className="p-4 pt-0 text-sm text-slate-400 border-t border-slate-800 bg-[#0a0a0a]">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Llevar botas de senderismo o calzado con buen agarre.</li>
                  <li>Prohibido dejar basura.</li>
                  <li>No usar repelentes químicos antes de entrar al agua.</li>
                  <li>Llevar impermeable ligero.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Chat */}
      <button 
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600/20 border border-emerald-500/50 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center z-30 hover:bg-emerald-500/30 hover:scale-105 transition-all"
      >
        <MessageSquare className="w-6 h-6 text-emerald-400" />
      </button>

      {/* Avisos Bottom Sheet */}
      {showAvisos && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" onClick={() => setShowAvisos(false)}></div>
          <div className="relative bg-[#121212] w-full rounded-t-3xl border-t border-slate-800 p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center text-slate-200"><Bell className="w-5 h-5 mr-2 text-emerald-400" /> Avisos en Vivo</h3>
              <button onClick={() => setShowAvisos(false)} className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              {avisos.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No hay avisos recientes.</p>
              ) : (
                avisos.map(aviso => (
                  <div key={aviso.id} className={`p-4 rounded-xl border ${aviso.urgencia === 'Alta' ? 'bg-red-950/20 border-red-900/50' : aviso.urgencia === 'Media' ? 'bg-amber-950/20 border-amber-900/50' : 'bg-[#0a0a0a] border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase ${aviso.urgencia === 'Alta' ? 'text-red-400' : aviso.urgencia === 'Media' ? 'text-amber-400' : 'text-slate-500'}`}>
                        {aviso.urgencia}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{new Date(aviso.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-sm text-slate-300">{aviso.mensaje}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
          <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" onClick={() => setShowChat(false)}></div>
          <div className="relative bg-[#121212] w-full md:w-[400px] h-[80vh] md:h-[600px] md:rounded-2xl rounded-t-3xl border border-slate-800 flex flex-col animate-in slide-in-from-bottom md:zoom-in shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1a1a1a] rounded-t-3xl md:rounded-t-2xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mr-3">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Guía SERAMBI (IA)</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">En línea</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 bg-[#121212] hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
              <div className="flex justify-start">
                <div className="bg-[#121212] border border-slate-800 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[80%] text-sm text-slate-300">
                  ¡Hola! Soy tu guía virtual de SERAMBI. ¿Tienes alguna duda sobre el ecosistema de Acaxochitlán o el equipo que debes llevar?
                </div>
              </div>
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl p-3 max-w-[80%] text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-100 rounded-tr-sm' 
                      : 'bg-[#121212] border border-slate-800 text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#121212] border border-slate-800 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[80%] flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-[#1a1a1a] pb-safe rounded-b-2xl">
              <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Escribe tu duda..."
                  className="flex-1 bg-[#0a0a0a] border border-slate-700 rounded-full px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 disabled:opacity-50 hover:bg-emerald-500/30 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

