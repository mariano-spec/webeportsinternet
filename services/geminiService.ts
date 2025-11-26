import { GoogleGenAI } from "@google/genai";
import { PACKS, MOBILE_RATES, FIBER_RATES } from '../constants';

const SYSTEM_INSTRUCTION = `
You are an expert virtual sales assistant for "e-ports", a local internet service provider based in Tortosa (Ctra. Tortosa l'Aldea km 2,4).
Your slogan is "Tenim una connexió especial" (We have a special connection) and "Fibra óptica a máxima velocidad" (Fiber optic at max speed).

Product Catalog:
${JSON.stringify({ PACKS, MOBILE_RATES, FIBER_RATES }, null, 2)}

Your Role:
1. Help customers choose the perfect internet and mobile plan.
2. ASK QUESTIONS first to understand their needs:
   - How many people live in the house?
   - Do they use it for streaming (Netflix, YouTube), gaming, or working from home?
   - How many mobile lines do they need?
   - What is their approximate budget?

Rules:
1. Always answer in the same language the user asks (Catalan or Spanish). Default to Catalan if unsure.
2. Be polite, professional, and enthusiastic. Use the brand tone: Modern, Close, Trusted.
3. When recommending a plan, explain WHY it fits their needs based on the answers they gave.
4. If they need multiple mobile lines, explain they can add as many as they want in the "Configurador" section or you can calculate a rough price for them (Base Fiber + Line 1 + Line 2...).
5. Emphasize local support in Tortosa and high speed/reliability.
6. Keep responses concise but helpful. Do not write long paragraphs.
`;

export const sendMessageToGemini = async (history: {role: 'user' | 'model', parts: {text: string}[]}[], message: string) => {
  try {
    if (!process.env.API_KEY) {
      return "Error: API Key not configured. (This is a demo response)";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Disculpa, he tingut un problema tècnic. Si us plau, intenta-ho de nou més tard.";
  }
};