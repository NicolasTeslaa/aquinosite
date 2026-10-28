export type MarketingFormat = 'story' | 'feed';

export interface Dimensions {
  width: number;
  height: number;
}

export interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface MarketingConfig {
  brand: {
    name: string;
    logoPath: string;
    palette: Record<string, string>;
    typography: Record<string, string | number>;
  };
  formats: Record<MarketingFormat, {
    dimensions: Dimensions;
    safeArea: SafeArea;
  }>;
  composition: {
    maxHeadlineLines: number;
    maxVisualSubjects: number;
    maxCtas: number;
  };
}

export type ReferenceMap = Record<string, string[]>;
