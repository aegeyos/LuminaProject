import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LogoConcept } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// Schema for the logo concepts
const logoConceptSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      conceptName: {
        type: Type.STRING,
        description: "A creative, catchy name for the logo design concept.",
      },
      visualDescription: {
        type: Type.STRING,
        description: "A highly detailed, structured visual description suitable for use as an image generation prompt. Include specific details about focal points, negative space usage, stroke weight, and composition logic. STRICTLY AVOID generic stock imagery descriptions.",
      },
      meaning: {
        type: Type.STRING,
        description: "A short explanation of why this concept fits the business and industry.",
      },
      colorPalette: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Usage: Primary, Secondary, or Accent" },
            name: { type: Type.STRING, description: "Creative color name (e.g., 'Electric Indigo')" },
            hex: { type: Type.STRING, description: "Hex code (e.g., #4F46E5)" },
          },
          required: ["type", "name", "hex"],
        },
        description: "A detailed color palette including primary, secondary, and accent colors.",
      },
    },
    required: ["conceptName", "visualDescription", "meaning", "colorPalette"],
  },
};

const refineConceptSchema: Schema = {
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
};

export const generateConcepts = async (businessName: string, industry: string, style: string): Promise<LogoConcept[]> => {
  if (!apiKey) throw new Error("API Key not found");

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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: logoConceptSchema,
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
  if (!apiKey) throw new Error("API Key not found");

  const prompt = `
    You are an expert design consultant iteratively refining a logo concept.
    
    Original Concept:
    ${JSON.stringify(originalConcept, null, 2)}
    
    User Feedback:
    "${feedback}"
    
    Task:
    - Revise the concept based strictly on the user feedback.
    - You may update the name, visual description, meaning, or color palette as requested.
    - If the feedback is about style, ensure the visual description reflects the new direction.
    - Ensure the visual description is highly detailed (focal points, negative space, stroke) and optimized for high-quality image generation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: refineConceptSchema,
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
  if (!apiKey) throw new Error("API Key not found");

  // Enhanced prompt to avoid stock look
  const prompt = `
    Professional high-end logo design. ${visualDescription}
    
    Style Guidelines:
    - Vector graphics style, clean lines.
    - White background.
    - NO realistic photo details, NO complex shading, NO text inside the logo symbol itself unless specified.
    - Avoid generic clipart aesthetics. 
    - High quality, award-winning design standard.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Check parts for the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data returned in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editLogoVisual = async (imageBase64: string, editPrompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  // Strip header if present to get raw base64
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Edit this logo design based on the following instruction: "${editPrompt}"
    
    Maintain the existing style, composition, and high quality unless explicitly asked to change them.
    Output the modified image.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', 
              data: base64Data
            }
          },
          { text: prompt },
        ],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data returned in response");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};