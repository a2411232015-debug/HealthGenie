import { GoogleGenAI, Type } from "@google/genai";

// Helper to convert file to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Image Analysis (Nutrition) using gemini-3-pro-preview
export const analyzeFoodImage = async (base64Image: string, mimeType: string) => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "請分析這張圖片中的食物。請回傳一個 JSON 物件，包含以下欄位：foodName (食物名稱), calories (預估熱量), nutrients (主要營養素簡述), advice (給健康飲食者的簡短建議)。請使用繁體中文。"
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.STRING },
            nutrients: { type: Type.STRING },
            advice: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

// 2. Image Editing using gemini-2.5-flash-image
export const editImage = async (base64Image: string, mimeType: string, prompt: string) => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Note: No responseMimeType for image models usually, but we expect an image part back
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Editing Error:", error);
    throw error;
  }
};

// 3. Location-Based Meal Recommendations using gemini-2.5-flash + Google Maps
export const getNearbyHealthyFood = async (latitude: number, longitude: number, query: string = "健康的午餐選擇") => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `我在這個位置 (緯度: ${latitude}, 經度: ${longitude})。${query}。請推薦附近 3-5 家適合的餐廳。`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude
            }
          }
        }
      }
    });

    // We return the raw text + grounding chunks to be processed by the UI
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Error:", error);
    throw error;
  }
};
