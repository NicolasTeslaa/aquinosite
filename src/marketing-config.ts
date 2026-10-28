import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { MarketingConfig, ReferenceMap } from './marketing-types.ts';

const root = resolve(process.cwd());

export function loadMarketingConfig(path = resolve(root, 'config/identidade-visual.json')): MarketingConfig {
  return JSON.parse(readFileSync(path, 'utf8')) as MarketingConfig;
}

export function loadReferenceMap(path = resolve(root, 'config/referencias-visuais.json')): ReferenceMap {
  return JSON.parse(readFileSync(path, 'utf8')) as ReferenceMap;
}

export function validateMarketingConfig(config: MarketingConfig): { valid: true } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  const story = config.formats.story;
  const feed = config.formats.feed;

  if (story.dimensions.width !== 1080 || story.dimensions.height !== 1920) {
    errors.push('story dimensions must be 1080x1920');
  }
  if (feed.dimensions.width !== 1080 || feed.dimensions.height !== 1080) {
    errors.push('feed dimensions must be 1080x1080');
  }
  if (!config.brand.logoPath.startsWith('assets/logo/')) {
    errors.push('brand.logoPath must point to assets/logo');
  }
  if (config.composition.maxHeadlineLines < 1 || config.composition.maxCtas !== 1) {
    errors.push('composition limits must define a headline and one CTA');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
