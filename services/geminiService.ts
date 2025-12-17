
import { GoogleGenAI } from "@google/genai";

// Guideline: Assume process.env.API_KEY is pre-configured and valid.
// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Updated to latest recommended model for basic text tasks
    const model = 'gemini-3-flash-preview';

    const prompt = `Write a compelling and concise product description (max 2 sentences) for a product named "${productName}" in the category "${category}". Highlight its key benefits.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Directly accessing .text property (not a method) as per guidelines.
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description due to an error.";
  }
};
