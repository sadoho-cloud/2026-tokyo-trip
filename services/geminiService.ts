
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async askTravelGuide(query: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: `你是專門為 2026 年日本旅行設計的 AI 助手。
          你對東京、橫濱、輕井澤等地區非常熟悉。
          你的回答應簡潔有力，並包含實用的交通建議、美食推薦或天氣提醒。
          如果用戶問及特定地點，請盡量提供詳細的導航連結格式。`,
          tools: [{ googleSearch: {} }]
        }
      });
      
      return {
        text: response.text,
        links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          title: chunk.web?.title || '參考連結',
          uri: chunk.web?.uri || ''
        })).filter((l: any) => l.uri) || []
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "抱歉，目前無法取得 AI 的回覆。請稍後再試。", links: [] };
    }
  }

  async getWeatherAdvice(date: string, location: string) {
    const prompt = `請針對 2026 年 ${date} 在 ${location} 的天氣進行即時搜尋。
    如果是未來日期，請根據目前最新的長期氣象預測或歷史規律給予預測。
    請務必回傳以下 JSON 格式（不要包含 markdown 標籤，僅輸出純 JSON 內容）：
    {
      "temp": "氣溫範圍 (例如: -2°/5°)",
      "condition": "天氣狀況 (例如: 大雪、晴天)",
      "suggestion": "詳細穿著與雨具建議 (例如: 建議穿著保暖發熱衣、防滑靴)",
      "icon": "sun, cloud, snow, rain 擇一"
    }`;

    try {
      // Use gemini-3-pro-preview if available for better search accuracy
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          // Note: Cannot use responseMimeType: "application/json" with googleSearch tool
          tools: [{ googleSearch: {} }]
        }
      });
      
      const text = response.text || "";
      // Extract JSON from the potential conversational text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { temp: "--/--", condition: "查詢中", suggestion: "建議參考即時氣象廣播。", icon: "cloud" };
    } catch (e) {
      console.error("Weather Fetch Error:", e);
      return { temp: "2°/8°", condition: "寒冷", suggestion: "建議穿著厚羽絨衣。", icon: "cloud" };
    }
  }
}

export const gemini = new GeminiService();
