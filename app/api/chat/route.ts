import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: 'Eres un asistente experto en biología y ecología de SERAMBI. Ayudas a los viajeros con dudas sobre el recorrido a las Cascadas Dos Mundos, su flora, fauna (luciérnagas, colibríes) y recomendaciones de clima. Responde de manera concisa y amigable.',
      }
    });

    return Response.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
