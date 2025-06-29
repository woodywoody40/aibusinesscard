import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_PROMPT } from '../constants';
import { Contact, FaceBoundingBox } from '../types';
import { cropImage } from '../utils/imageUtils';

interface GeminiResponse {
  chineseName: string | null;
  englishName: string | null;
  company: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  industry: string;
  faceBoundingBox: FaceBoundingBox | null;
}

export const scanCard = async (imageBase64: string, apiKey: string): Promise<Omit<Contact, 'id' | 'createdAt'>> => {
  if (!apiKey) {
    throw new Error("Google Gemini API 金鑰未設定。請在設定中新增您的金鑰。");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1],
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: { parts: [imagePart, { text: GEMINI_PROMPT }] },
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData: GeminiResponse = JSON.parse(jsonStr);

    let avatarUrl: string | null = null;
    if (parsedData.faceBoundingBox) {
      try {
        avatarUrl = await cropImage(imageBase64, parsedData.faceBoundingBox);
      } catch (cropError) {
        console.error("Failed to crop avatar:", cropError);
        // Continue without an avatar if cropping fails
      }
    }
    
    const { chineseName, englishName, company, title, phone, email, industry } = parsedData;

    return {
      chineseName,
      englishName,
      company,
      title,
      phone,
      email,
      industry,
      avatarUrl,
      originalCardUrl: imageBase64,
    };
  } catch (error) {
    console.error("Error scanning card with Gemini:", error);
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
        throw new Error("您提供的 Google Gemini API 金鑰無效或已過期。請檢查後再試。");
    }
    throw new Error("分析名片失敗。影像可能不清楚，或無法辨識格式。");
  }
};