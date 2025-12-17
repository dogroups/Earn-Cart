import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return "AI generation unavailable: Missing API Key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    // Updated to latest recommended model for basic text tasks
    const model = 'gemini-3-flash-preview';

    const prompt = `Write a compelling and concise product description (max 2 sentences) for a product named "${productName}" in the category "${category}". Highlight its key benefits.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description due to an error.";
  }
};