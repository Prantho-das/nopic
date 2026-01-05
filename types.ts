
export type BackgroundStyle = 
  | 'studio' | 'marble' | 'wood' | 'nature' | 'home' 
  | 'luxury' | 'tech' | 'urban' | 'baby' | 'tool' 
  | 'summer' | 'office' | 'cozy' | 'cyberpunk' | 'minimalist' 
  | 'autumn' | 'vintage' | 'popart' | 'dark_moody' | 'neon';

export type BrandVoice = 'professional' | 'luxury' | 'playful' | 'minimalist' | 'urgent';

export interface ProductListing {
  titleEN: string;
  titleBN: string;
  descriptionEN: string;
  descriptionBN: string;
  salesHookEN: string;
  salesHookBN: string;
  ctaEN: string;
  ctaBN: string;
  featuresEN: string[];
  featuresBN: string[];
  seoKeywordsEN: string[];
  seoKeywordsBN: string[];
  suggestedPrice?: string;
  jsonLd: string;
  marketplaces: {
    amazon: string;
    shopify: string;
    etsy: string;
    facebook: string;
  };
}

export interface ProcessingStatus {
  step: 'idle' | 'analyzing' | 'enhancing' | 'storing' | 'completed' | 'error';
  message: string;
}

export interface EnhancedVariant {
  url: string;
  styleLabel: string;
}

export interface ImageData {
  original: string;
  variants: EnhancedVariant[];
  mimeType: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface ProductRecord {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  description: string;
  image_urls: string[];
  listing_data: ProductListing;
  created_at: string;
}

export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
}
