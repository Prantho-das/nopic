
export type BackgroundStyle = 
  | 'studio' | 'marble' | 'wood' | 'nature' | 'home' 
  | 'luxury' | 'tech' | 'urban' | 'baby' | 'tool' 
  | 'summer' | 'office';

export interface ProductListing {
  titleEN: string;
  titleBN: string;
  descriptionEN: string;
  descriptionBN: string;
  featuresEN: string[];
  featuresBN: string[];
  seoKeywordsEN: string[];
  seoKeywordsBN: string[];
  suggestedPrice?: string;
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
