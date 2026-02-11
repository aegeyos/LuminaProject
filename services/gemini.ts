
import { GoogleGenAI, Type } from "@google/genai";
import { LogoConcept } from '../types';

/**
 * Fix: Use process.env.API_KEY exclusively for API key access as per @google/genai guidelines.
 * Always create a new instance before API calls to ensure it uses the latest key from the execution context.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    - Explicitly describe the focal point and the usage of negative space.
    - Provide a detailed color palette for each concept including specific HEX codes.

    For each concept, provide:
    1. A creative Name.
    2. A detailed visual prompt description.
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
  const ai = getAI();

  const prompt = `
    You are an expert design consultant iteratively refining a logo concept.
    
    Original Concept:
    ${JSON.stringify(originalConcept, null, 2)}
    
    User Feedback:
    "${feedback}"
    
    Task:
    - Revise the concept based strictly on the user feedback.
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

/**
 * Fix: Use gemini-2.5-flash-image via generateContent as the default for image generation.
 * This simplifies the logic and strictly adheres to the @google/genai guidelines for general tasks.
 */
export const generateLogoVisual = async (visualDescription: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Professional high-end minimalist logo design, vector graphics style, clean lines, flat design, solid white background. Focal elements: ${visualDescription}. NO realistic photo details, NO complex shading, NO text.`;

  try {
    // Generate image using the recommended gemini-2.5-flash-image model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      // Find the image part in the response, do not assume it is the first part.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Model failed to generate inline image data.");
  } catch (error) {
    console.error("Critical error: Image generation failed.", error);
    throw new Error("Unable to visualize concept at this time. Please try a different description.");
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
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      // Iterate through all parts to find the image part.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found after editing attempt");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
