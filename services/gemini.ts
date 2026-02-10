import { GoogleGenAI, Type } from "@google/genai";
import { LogoConcept } from '../types';

export const generateConcepts = async (businessName: string, industry: string, style: string): Promise<LogoConcept[]> => {
  // Use import.meta.env.VITE_GEMINI_API_KEY as requested for Vite/Vercel environment compatibility
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  const prompt = `
    You are a world-class brand identity designer. 
    Create 3 distinct, professional, and creative logo design concepts for a business.
    
    Business Name: "${businessName}"
    Industry/Theme: "${industry}"
    Preferred Style: "${style}"
    
    Guidelines:
    - Focus heavily on the requested style: "${style}".
    - STRICTLY AVOID generic stock imagery (e.g., no generic lightbulbs for ideas, no generic globes for tech).
    - Focus on unique geometric abstractions, clever negative space, or custom illustrative styles.
    - Explicitly describe the focal point, the usage of negative space, and the stroke weight/style (e.g., monoline, variable width) in the visual description.
    - Provide a detailed color palette for each concept including specific HEX codes.

    For each concept, provide:
    1. A creative Name.
    2. A detailed visual prompt description (including composition, focal points, stroke details).
    3. The rationale/meaning.
    4. A detailed color palette (Primary, Secondary, Accent) with HEX codes.
  `;

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
        systemInstruction: "You are an expert design consultant for elite brand agencies. Output strictly JSON.",
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
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const prompt = `
    You are an expert design consultant iteratively refining a logo concept.
    
    Original Concept:
    ${JSON.stringify(originalConcept, null, 2)}
    
    User Feedback:
    "${feedback}"
    
    Task:
    - Revise the concept based strictly on the user feedback.
    - Ensure the visual description is highly detailed (focal points, negative space, stroke) and optimized for high-quality image generation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

export const generateLogoVisual = async (visualDescription: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const prompt = `
    Professional high-end minimalist logo design. ${visualDescription}
    
    Style Guidelines:
    - Vector graphics style, clean lines, flat design.
    - Solid white background.
    - NO realistic photo details, NO complex shading, NO text inside the logo symbol.
    - Balanced composition, elegant proportions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editLogoVisual = async (imageBase64: string, editPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Edit this logo design based on: "${editPrompt}"
    Keep it as a clean vector logo on a white background. Maintain consistent style.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};