import type { MarketingFormat } from './marketing-types.ts';

export interface PublishInput {
  assetPath: string;
  imageUrl: string;
  hash: string;
  format: MarketingFormat;
  caption?: string;
  logPath: string;
}

export interface PublishResult {
  status: 'published' | 'failed' | 'duplicate';
  assetPath: string;
  hash: string;
  mediaId?: string;
  permalink?: string;
  error?: string;
  [key: string]: unknown;
}
