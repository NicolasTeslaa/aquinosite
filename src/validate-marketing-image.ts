import { basename } from 'node:path';
import sharp from 'sharp';

import { loadMarketingConfig } from './marketing-config.ts';
import { assertUniqueHash, sha256File } from './marketing-identity.ts';
import type { MarketingFormat } from './marketing-types.ts';

export interface ValidateImageInput {
  imagePath: string;
  format: MarketingFormat;
  logoApplied: boolean;
  copyBounds: { x: number; y: number; width: number; height: number };
  hashRecords: Array<{ hash: string }>;
}

export type ValidationResult = { valid: true; hash: string } | { valid: false; errors: string[] };

export async function validateMarketingImage(input: ValidateImageInput): Promise<ValidationResult> {
  const config = loadMarketingConfig();
  const metadata = await sharp(input.imagePath).metadata();
  const dimensions = config.formats[input.format].dimensions;
  const safe = config.formats[input.format].safeArea;
  const errors: string[] = [];
  const hash = await sha256File(input.imagePath);

  if (metadata.width !== dimensions.width || metadata.height !== dimensions.height) errors.push(`image must be ${dimensions.width}x${dimensions.height}`);
  if (!input.logoApplied) errors.push('official logo must be applied');
  if (input.copyBounds.x < safe.left || input.copyBounds.y < safe.top || input.copyBounds.x + input.copyBounds.width > dimensions.width - safe.right || input.copyBounds.y + input.copyBounds.height > dimensions.height - safe.bottom) {
    errors.push('copy leaves the configured safe area');
  }
  if (!/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_[a-z0-9-]+_v\d{2}\.png$/.test(basename(input.imagePath))) errors.push('filename does not follow the marketing convention');
  try { assertUniqueHash(hash, input.hashRecords); } catch { errors.push('duplicate marketing asset hash'); }

  return errors.length ? { valid: false, errors } : { valid: true, hash };
}
