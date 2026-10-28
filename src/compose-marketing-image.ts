import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

import { loadMarketingConfig } from './marketing-config.ts';
import type { MarketingFormat } from './marketing-types.ts';

export interface ComposeInput {
  scenePath: string;
  outputPath: string;
  format: MarketingFormat;
  logoPath: string;
  headline: string;
  body: string;
  cta: string;
}

export interface ComposeResult {
  outputPath: string;
  copyBounds: { x: number; y: number; width: number; height: number };
  logoApplied: true;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function composeMarketingImage(input: ComposeInput): Promise<ComposeResult> {
  const config = loadMarketingConfig();
  const dimensions = config.formats[input.format].dimensions;
  const safe = config.formats[input.format].safeArea;
  const isStory = input.format === 'story';
  const headlineSize = isStory ? 72 : 64;
  const bodySize = isStory ? 34 : 30;
  const maxChars = isStory ? 30 : 42;
  const bodyLines = wrapText(input.body, maxChars);
  const headlineLines = wrapText(input.headline, isStory ? 22 : 28);
  const headlineY = safe.top + 110;
  const bodyY = headlineY + headlineLines.length * (headlineSize + 16) + 50;
  const ctaY = dimensions.height - safe.bottom - 110;
  const logoWidth = isStory ? 260 : 240;
  const logoHeight = isStory ? 135 : 120;
  const logoX = safe.left;
  const logoY = ctaY + 45;
  const copyBottom = ctaY + 70;
  const copyBounds = {
    x: safe.left,
    y: headlineY - headlineSize,
    width: dimensions.width - safe.left - safe.right,
    height: copyBottom - (headlineY - headlineSize)
  };

  await mkdir(dirname(input.outputPath), { recursive: true });
  const textSvg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .headline { font-family: Arial, sans-serif; font-size: ${headlineSize}px; font-weight: 800; fill: ${config.brand.palette.blue}; }
      .body { font-family: Arial, sans-serif; font-size: ${bodySize}px; font-weight: 600; fill: ${config.brand.palette.text}; }
      .cta { font-family: Arial, sans-serif; font-size: ${isStory ? 34 : 30}px; font-weight: 700; fill: ${config.brand.palette.white}; }
    </style>
    <rect width="100%" height="100%" fill="rgba(255,255,255,0.72)"/>
    ${headlineLines.map((line, index) => `<text x="${dimensions.width / 2}" y="${headlineY + index * (headlineSize + 16)}" text-anchor="middle" class="headline">${escapeXml(line)}</text>`).join('')}
    ${bodyLines.map((line, index) => `<text x="${dimensions.width / 2}" y="${bodyY + index * (bodySize + 12)}" text-anchor="middle" class="body">${escapeXml(line)}</text>`).join('')}
    <rect x="${safe.left}" y="${ctaY - 55}" rx="36" width="${dimensions.width - safe.left - safe.right}" height="90" fill="${config.brand.palette.blue}"/>
    <text x="${dimensions.width / 2}" y="${ctaY + 4}" text-anchor="middle" class="cta">${escapeXml(input.cta)}</text>
  </svg>`;

  const resizedLogo = await sharp(input.logoPath).resize({ width: logoWidth, height: logoHeight, fit: 'contain', background: '#FFFFFF' }).flatten({ background: '#FFFFFF' }).png().toBuffer();
  await sharp(input.scenePath)
    .resize(dimensions.width, dimensions.height, { fit: 'cover' })
    .composite([
      { input: Buffer.from(textSvg), top: 0, left: 0 },
      { input: resizedLogo, top: logoY, left: logoX }
    ])
    .flatten({ background: '#FFFFFF' })
    .removeAlpha()
    .png()
    .toFile(input.outputPath);

  return { outputPath: input.outputPath, copyBounds, logoApplied: true };
}
