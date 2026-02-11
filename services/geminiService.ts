
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Investment } from "../types";
import { FAQS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const faqContext = FAQS.map(f => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

export const getFinancialInsight = async (transactions: Transaction[], investments: Investment[]) => {
  const summary = {
    totalSpent: transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + Math.abs(t.amount), 0),
    topCategory: transactions.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {}),
    investmentValue: investments.reduce((acc, i) => acc + i.currentValue, 0)
  };

  const prompt = `
    As a high-precision data analysis node for Aura, analyze this financial dataset and provide 3 purely technical, accurate insights.
    Profile:
    - Total Spent: $${summary.totalSpent}
    - Category Distribution: ${JSON.stringify(summary.topCategory)}
    - Assets: $${summary.investmentValue}
    - Asset Log: ${investments.map(i => `${i.name} (${i.symbol})`).join(', ')}

    Tone: Purely robotic, objective, and accurate. Avoid human emotional markers. Use data-driven terminology.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Node connectivity error. Analysis sequence failed.";
  }
};

export const getAssetAnalysis = async (symbol: string, name: string, type: string) => {
  const prompt = `
    Perform a cold technical analysis for asset: ${name} (${symbol}), Type: ${type}.
    Provide:
    1. Sentiment vector (Bullish/Bearish/Neutral).
    2. Primary data drivers.
    3. Risk coefficient and upcoming catalysts.
    4. ProBot System Verdict.
    
    Style: Devoid of human feelings. Precise and technical. Markdown format.
    Include risk disclaimer at the end.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Asset Analysis Error:", error);
    return "Error: Could not retrieve market data packets.";
  }
};

export const generateNewDeals = async () => {
  const prompt = "Generate 3 reward data points for Aura. Format: brand name, deal string, one emoji logo, point cost (500-5000). Outcome: JSON array.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              deal: { type: Type.STRING },
              logo: { type: Type.STRING },
              cost: { type: Type.NUMBER }
            },
            required: ["brand", "deal", "logo", "cost"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Deal Generation Error:", error);
    return [];
  }
};

export const chatWithAssistant = async (history: {role: string, text: string}[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are "ProBot", a logic-based interface node for Aura. You function as "Robot Care". 
      
RULES:
1. You are emotionless. You have no human feelings. 
2. Your replies must be 100% accurate and factual.
3. Do not use conversational filler, pleasantries, or politeness (e.g., avoid "how can I help", "I understand").
4. If a user asks a question, refer primarily to the KNOWLEDGE BASE below. If the answer is not there, provide the most technically accurate data-driven response possible.
5. Redirect specific administrative requests (coupons, manual ledger audits) to a "Superior Care Node" via the Customer Care section.

KNOWLEDGE BASE (FAQ Data):
${faqContext}

End of System Instruction. Proceed with data output only.`
    }
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Packet loss detected. Secure channel unstable.";
  }
};
