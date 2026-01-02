
import { GoogleGenAI, Type } from "@google/genai";
import { ProductListing, BackgroundStyle, BrandVoice } from "../types";

const STYLE_PROMPTS: Record<BackgroundStyle, string> = {
  studio: "Professional commercial product photography, plain white cyclorama, soft strobe lighting. Extremely sharp textures, natural soft shadows, crisp clean look.",
  marble: "Product on a real polished Carrara marble surface, high-end boutique lighting, elegant reflections, minimal and clean luxury.",
  wood: "Placed on an authentic oak wood table, natural morning window light, shallow depth of field, rustic and organic vibes.",
  nature: "Resting on a mossy stone in a lush garden, dappled sunlight, natural greenery bokeh, fresh and outdoor feeling.",
  home: "Minimalist modern living room setting, blurred domestic background, realistic warm lighting, cozy lifestyle photography.",
  luxury: "Sophisticated dark velvet background, dramatic directional lighting, luxury jewelry store vibe, high-contrast and elite.",
  tech: "Matte carbon fiber surface, futuristic blue rim lighting, industrial professional look, sharp and innovative.",
  urban: "On a weathered concrete ledge, urban street background with soft bokeh, authentic daylight, gritty and modern city look.",
  baby: "Soft high-quality cotton background, gentle nursery light, pastel aesthetic, safe and warm feeling.",
  tool: "Brushed steel workbench, industrial overhead lighting, gritty realistic metal textures, work-in-progress vibe.",
  summer: "Resting on real fine beach sand, bright direct sunlight, vibrant vacation look, tropical and warm.",
  office: "Modern glass office desk, corporate background in soft focus, bright LED office lighting, clean professional workspace.",
  cozy: "Warm indoor setting with fairy lights, soft knit textures, inviting evening glow, very intimate and comforting.",
  cyberpunk: "Futuristic street alley, neon pink and teal lighting, rainy reflections, high-tech industrial aesthetic.",
  minimalist: "Ultra-clean light grey background, architectural shadows, extremely simple and modern high-end studio.",
  autumn: "Surrounded by warm orange fallen leaves, rustic wooden surface, golden hour light, seasonal and earthy.",
  vintage: "Retro 70s interior, warm grainy film look, muted nostalgic colors, classic aesthetic.",
  popart: "Vibrant solid color background (vivid yellow), bold flat lighting, high contrast commercial style, eye-catching.",
  dark_moody: "Black stone surface, single spotlight, deep shadows, cinematic atmosphere, mysterious and high-end.",
  neon: "Vibrant neon tubes in the background, dark environment, glowing product edges, futuristic and nightlife feel."
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
          2. The result must be a clean, high-fidelity commercial image.
          3. Ensure zero AI artifacts; textures must be sharp and organic.
          ${watermarkInstruction}` }
      ],
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error('Image generation failed');
  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
};

export const generateProductCopy = async (
  base64Data: string, 
  mimeType: string, 
  brandName: string = "SnapSell User", 
  voice: BrandVoice = "professional"
): Promise<ProductListing> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `Generate a high-converting, sales-driven e-commerce listing for the brand "${brandName}" using a ${voice} voice. 
        
        CONTENT & SEO REQUIREMENTS:
        1. Sales Focus: Create a powerful "Sales Hook" (catchy first line) and a "Call to Action" (CTA).
        2. Multi-lingual support: Professional English and standard, natural-sounding Bangla.
        3. Bangla SEO Deep Dive: Generate 10-15 localized Bangla keywords that people in Bangladesh actually use on Facebook Marketplace, Daraz, and Bikroy. Include common variations and phonetic spellings if applicable.
        4. Marketplaces:
           - Amazon: 5 bullet points.
           - Shopify: Compelling story.
           - Etsy: Craftsmanship focus.
        5. SEO: Generate a JSON-LD script for Product schema.
        
        FORMAT:
        Return a JSON object matching the ProductListing interface.` }
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
          salesHookEN: { type: Type.STRING },
          salesHookBN: { type: Type.STRING },
          ctaEN: { type: Type.STRING },
          ctaBN: { type: Type.STRING },
          featuresEN: { type: Type.ARRAY, items: { type: Type.STRING } },
          featuresBN: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoKeywordsEN: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoKeywordsBN: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedPrice: { type: Type.STRING },
          jsonLd: { type: Type.STRING },
          marketplaces: {
            type: Type.OBJECT,
            properties: {
              amazon: { type: Type.STRING },
              shopify: { type: Type.STRING },
              etsy: { type: Type.STRING }
            }
          }
        },
        required: ["titleEN", "titleBN", "descriptionEN", "descriptionBN", "salesHookEN", "salesHookBN", "ctaEN", "ctaBN", "seoKeywordsBN", "jsonLd", "marketplaces"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProductListing;
};
