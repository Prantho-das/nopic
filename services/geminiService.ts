import { GoogleGenAI, Type } from "@google/genai";
import { ProductListing, BackgroundStyle } from "../types";

const STYLE_PROMPTS: Record<BackgroundStyle, string> = {
  studio: "Professional commercial product photography, plain white cyclorama, soft strobe lighting, Sony A7R IV, 85mm lens. Extremely sharp textures, natural soft shadows, zero digital noise.",
  marble: "Product on a real polished Carrara marble surface, high-end boutique lighting, elegant reflections, realistic stone texture.",
  wood: "Placed on an authentic oak wood table, natural morning window light, shallow depth of field, sharp focus on product, organic feel.",
  nature: "Resting on a mossy stone in a lush garden, dappled sunlight, natural greenery bokeh, golden hour photography.",
  home: "Minimalist modern living room setting, blurred domestic background, realistic warm lighting, professional lifestyle shot.",
  luxury: "Sophisticated dark velvet background, dramatic directional lighting, luxury jewelry store vibe, sharp focus.",
  tech: "Matte carbon fiber surface, futuristic blue rim lighting, industrial professional look, clean and sharp.",
  urban: "On a weathered concrete ledge, urban street background with soft bokeh, authentic daylight, gritty but professional.",
  baby: "Soft high-quality cotton background, gentle nursery light, pastel aesthetic, safe and warm feeling.",
  tool: "Brushed steel workbench, industrial overhead lighting, gritty realistic metal textures, work-in-progress vibe.",
  summer: "Resting on real fine beach sand, bright direct sunlight, sharp palm shadows, vibrant but realistic vacation look.",
  office: "Modern glass office desk, corporate background in soft focus, bright LED office lighting, clean professional workspace."
};

export const enhanceProductImage = async (base64Data: string, mimeType: string, style: BackgroundStyle, watermark?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const watermarkInstruction = watermark 
    ? `IMPORTANT: Add a subtle, professional text watermark that says "${watermark}" in a clean white sans-serif font, 20% opacity, bottom-right corner.` 
    : "";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `TASK: Photorealistic E-commerce Enhancement. 
          STYLING: ${STYLE_PROMPTS[style]} 
          STRICT RULES: 
          1. Keep the product's original shape, brand labels, and colors 100% accurate. 
          2. The result must look like a real photo, NOT digital art or AI-generated. 
          3. Use professional camera physics (aperture, focal length).
          4. Make it look highly attractive for a premium website while maintaining total authenticity.
          ${watermarkInstruction}` }
      ],
    },
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error('Image generation failed');
  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
};

export const generateProductCopy = async (base64Data: string, mimeType: string): Promise<ProductListing> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `Generate high-converting, professional e-commerce listing copy in both English and Bangla. 
        
        SEO INSTRUCTIONS: 
        - If the product is an edible item (fruit, vegetable, organic food), explicitly emphasize its "Healthy", "Organic", and "Fresh" nature. 
        - Use words like "Premium Quality", "Natural", "Nutrient-Rich", and "Must-try".
        - Ensure the descriptions are persuasive for a buyer looking for health benefits.
        
        FORMAT:
        Return a JSON object with title, description, features, and SEO keywords for both languages.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titleEN: { type: Type.STRING },
          titleBN: { type: Type.STRING },
          descriptionEN: { type: Type.STRING },
          descriptionBN: { type: Type.STRING },
          featuresEN: { type: Type.ARRAY, items: { type: Type.STRING } },
          featuresBN: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoKeywordsEN: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoKeywordsBN: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedPrice: { type: Type.STRING }
        },
        required: ["titleEN", "titleBN", "descriptionEN", "descriptionBN", "featuresEN", "featuresBN", "seoKeywordsEN", "seoKeywordsBN"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProductListing;
};
