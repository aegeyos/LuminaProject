import { GoogleGenAI, Type } from "@google/genai";
import { LogoConcept } from '../types';

/**
 * Hem Vercel (Vite) hem de AI Studio test ortamı için uyumlu anahtar çağrısı.
 * Vite projelerinde import.meta.env kullanılır, process.env hata verir.
 *
 */
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAjm33H-pMYNRSLq-7DYApN4gyc5rVd4Jo";
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const generateConcepts = async (businessName: string, industry: string, style: string): Promise<LogoConcept[]> => {
  const ai = getAI();
  
  const prompt = `
    You are a world-class brand identity designer. 
    Create 3 distinct, professional, and creative logo design concepts for a business.
    
    Business Name: "${businessName}"
    Industry/Theme: "${industry}"
    Preferred Style: "${style}"
    
    Guidelines:
    - Focus heavily on the requested style: "${style}".
    - STRICTLY AVOID generic stock imagery.
    - Focus on unique geometric abstractions, clever negative space, or custom illustrative styles.
    - Explicitly describe the focal point, the usage of negative space, and the stroke weight/style.
    - Provide a detailed color palette for each concept including specific HEX codes.

    For each concept, provide:
    1. A creative Name.
    2. A detailed visual prompt description (optimized for Imagen 3).
    3. The rationale/meaning.
    4. A detailed color palette (Primary, Secondary, Accent) with HEX codes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              conceptName: { type: Type.STRING },
              visualDescription: { type: Type.STRING },
              meaning: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                  },
                  required: ["type", "name", "hex"],
                },
              },
            },
            required: ["conceptName", "visualDescription", "meaning", "colorPalette"],
          },
        },
        systemInstruction: "You are an expert design consultant. Output strictly JSON.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as LogoConcept[];
  } catch (error) {
    console.error("Error generating concepts:", error);
    throw error;
  }
};

export const refineConcept = async (originalConcept: LogoConcept, feedback: string): Promise<LogoConcept> => {
  const ai = getAI();

  const prompt = `
    You are an expert design consultant iteratively refining a logo concept.
    
    Original Concept:
    ${JSON.stringify(originalConcept, null, 2)}
    
    User Feedback:
    "${feedback}"
    
    Task:
    - Revise the concept based strictly on the user feedback.
    - Ensure the visual description is highly detailed and optimized for Imagen 3.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            visualDescription: { type: Type.STRING },
            meaning: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                },
                required: ["type", "name", "hex"],
              },
            },
          },
          required: ["conceptName", "visualDescription", "meaning", "colorPalette"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as LogoConcept;
  } catch (error) {
    console.error("Error refining concept:", error);
    throw error;
  }
};

/**
 * Görsel üretimi için Imagen 3 modelini kullanan en güncel fonksiyon.
 *
 */
export const generateLogoVisual = async (visualDescription: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Professional high-end minimalist logo design, vector graphics style, clean lines, flat design, solid white background. Focal elements: ${visualDescription}. NO realistic photo details, NO complex shading, NO text.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3', 
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1"
      }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64 = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64}`;
    }
    
    throw new Error("No image data returned from Imagen");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Görsel üretilemedi. Lütfen tekrar deneyin.");
  }
};

export const editLogoVisual = async (imageBase64: string, editPrompt: string): Promise<string> => {
  const ai = getAI();
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Edit this logo design based on: "${editPrompt}"
    Maintain the existing professional style: clean vector logo, solid white background, flat colors, no text.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found after editing");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};