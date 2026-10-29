import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

import { loadMarketingConfig } from './marketing-config.ts';
import type { MarketingFormat } from './marketing-types.ts';

export interface ComposeInput {
  scenePath: string;
  sceneFit?: 'cover' | 'contain';
  outputPath: string;
  format: MarketingFormat;
  logoPath: string;
  headline: string;
  body: string;
  cta: string;
  visualStyle?: 'default' | 'reference-high-contrast' | 'reference-white-arc';
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

export function editorialHeadlineLines(text: string, format: MarketingFormat): string[] {
  return wrapText(text.toUpperCase(), format === 'story' ? 17 : 12).slice(0, 3);
}

export async function composeMarketingImage(input: ComposeInput): Promise<ComposeResult> {
  const config = loadMarketingConfig();
  const dimensions = config.formats[input.format].dimensions;
  const safe = config.formats[input.format].safeArea;
  const isStory = input.format === 'story';
  const isReferenceStyle = input.visualStyle === 'reference-high-contrast';
  const isWhiteArcStyle = input.visualStyle === 'reference-white-arc';
  const copyBounds = isReferenceStyle
    ? {
        x: safe.left,
        y: isStory ? 280 : 120,
        width: isStory ? dimensions.width - safe.left - safe.right : 440,
        height: isStory ? 1100 : 650
      }
    : {
        x: safe.left,
        y: safe.top,
        width: isStory ? dimensions.width - safe.left - safe.right : 440,
        height: isStory ? 820 : 720
      };

  await mkdir(dirname(input.outputPath), { recursive: true });
  const referenceHeadlineSize = isStory ? 70 : 58;
  const referenceHeadlineLines = wrapText(input.headline, isStory ? 23 : 18);
  const referenceBodyLines = wrapText(input.body, isStory ? 34 : 24);
  const referenceHeadlineY = isStory ? 350 : 180;
  const referenceBodyY = referenceHeadlineY + referenceHeadlineLines.length * (referenceHeadlineSize + 10) + 45;
  const referenceCtaY = isStory ? 1260 : 650;
  const referenceLogoX = safe.left;
  const referenceLogoY = isStory ? 1410 : 820;
  const referenceLogoWidth = isStory ? 260 : 230;
  const referenceLogoHeight = isStory ? 135 : 120;
  const referenceSvg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .headline { font-family: Arial, sans-serif; font-size: ${referenceHeadlineSize}px; font-weight: 800; fill: ${config.brand.palette.white}; }
      .body { font-family: Arial, sans-serif; font-size: ${isStory ? 31 : 25}px; font-weight: 600; fill: ${config.brand.palette.white}; }
      .cta { font-family: Arial, sans-serif; font-size: ${isStory ? 32 : 27}px; font-weight: 800; fill: ${config.brand.palette.navy}; }
    </style>
    <rect x="${isStory ? 830 : 470}" y="0" width="${isStory ? 250 : 150}" height="${isStory ? 120 : 150}" rx="${isStory ? 44 : 36}" fill="${config.brand.palette.cyan}"/>
    <rect x="${safe.left}" y="${referenceHeadlineY - referenceHeadlineSize - 35}" width="74" height="10" rx="5" fill="${config.brand.palette.cyan}"/>
    ${referenceHeadlineLines.map((line, index) => `<text x="${safe.left}" y="${referenceHeadlineY + index * (referenceHeadlineSize + 10)}" class="headline">${escapeXml(line)}</text>`).join('')}
    ${referenceBodyLines.map((line, index) => `<text x="${safe.left}" y="${referenceBodyY + index * (isStory ? 43 : 35)}" class="body">${escapeXml(line)}</text>`).join('')}
    <rect x="${safe.left}" y="${referenceCtaY}" width="${isStory ? 620 : 420}" height="${isStory ? 86 : 76}" rx="${isStory ? 28 : 24}" fill="${config.brand.palette.cyan}"/>
    <text x="${safe.left + (isStory ? 310 : 210)}" y="${referenceCtaY + (isStory ? 56 : 50)}" text-anchor="middle" class="cta">${escapeXml(input.cta)}</text>
    <rect x="${referenceLogoX}" y="${referenceLogoY}" width="${referenceLogoWidth + 40}" height="${referenceLogoHeight + 28}" rx="16" fill="#FFFFFF"/>
  </svg>`;

  const ink = config.brand.palette.ink ?? '#071B3A';
  const editorialHeadlineSize = isStory ? 78 : 68;
  const headlineLines = editorialHeadlineLines(input.headline, input.format);
  const editorialBodyLines = wrapText(input.body, isStory ? 38 : 28).slice(0, 3);
  const editorialHeadlineY = isStory ? 410 : 205;
  const editorialBodyY = editorialHeadlineY + headlineLines.length * (editorialHeadlineSize - 4) + (isStory ? 46 : 34);
  const editorialCtaY = isStory ? 805 : 690;
  const editorialLogoX = safe.left;
  const editorialLogoY = isStory ? 1370 : 855;
  const editorialLogoWidth = isStory ? 260 : 230;
  const editorialLogoHeight = isStory ? 135 : 120;
  const editorialSvg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .eyebrow { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${isStory ? 26 : 22}px; font-weight: 800; letter-spacing: 1.2px; fill: ${config.brand.palette.white}; }
      .headline { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${editorialHeadlineSize}px; font-weight: 900; fill: ${config.brand.palette.white}; }
      .body { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${isStory ? 32 : 27}px; font-weight: 600; fill: ${isStory ? config.brand.palette.white : '#DCEBFF'}; }
      .cta { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${isStory ? 31 : 27}px; font-weight: 800; fill: ${ink}; }
    </style>
    <rect x="${safe.left}" y="${isStory ? 300 : 100}" width="${isStory ? 310 : 290}" height="${isStory ? 52 : 44}" rx="22" fill="${config.brand.palette.blue}"/>
    <text x="${safe.left + (isStory ? 155 : 145)}" y="${isStory ? 335 : 130}" text-anchor="middle" class="eyebrow">AQUINOSITE SAÚDE</text>
    ${headlineLines.map((line, index) => `<text x="${safe.left}" y="${editorialHeadlineY + index * (editorialHeadlineSize - 4)}" class="headline">${escapeXml(line)}</text>`).join('')}
    ${editorialBodyLines.map((line, index) => `<text x="${safe.left}" y="${editorialBodyY + index * (isStory ? 43 : 36)}" class="body">${escapeXml(line)}</text>`).join('')}
    <rect x="${safe.left}" y="${editorialCtaY}" width="${isStory ? 600 : 400}" height="${isStory ? 84 : 74}" rx="${isStory ? 42 : 37}" fill="${config.brand.palette.cyan}"/>
    <text x="${safe.left + (isStory ? 300 : 200)}" y="${editorialCtaY + (isStory ? 55 : 49)}" text-anchor="middle" class="cta">${escapeXml(input.cta)}</text>
    ${isStory
      ? `<path d="M0 930 C220 850 430 1035 650 955 C815 895 930 845 1080 900 L1080 1015 C905 965 790 1015 635 1070 C410 1150 210 970 0 1055 Z" fill="${config.brand.palette.blue}"/>
         <path d="M0 1010 C230 920 420 1115 650 1035 C820 975 930 925 1080 970 L1080 1015 C920 970 805 1035 650 1090 C420 1170 225 985 0 1075 Z" fill="${config.brand.palette.cyan}"/>`
      : `<path d="M0 900 C210 790 400 980 620 900 C805 832 930 800 1080 835 L1080 940 C915 905 790 950 625 1008 C405 1085 205 895 0 1000 Z" fill="${config.brand.palette.blue}"/>
         <path d="M0 955 C215 845 405 1030 630 955 C805 896 935 855 1080 890 L1080 940 C925 910 805 965 635 1022 C410 1098 215 910 0 1015 Z" fill="${config.brand.palette.cyan}"/>`}
    <rect x="${editorialLogoX}" y="${editorialLogoY}" width="${editorialLogoWidth + 40}" height="${editorialLogoHeight + 28}" rx="18" fill="#FFFFFF"/>
  </svg>`;

  const finalLogoWidth = isReferenceStyle ? referenceLogoWidth : editorialLogoWidth;
  const finalLogoHeight = isReferenceStyle ? referenceLogoHeight : editorialLogoHeight;
  const finalLogoX = isReferenceStyle ? referenceLogoX + 20 : editorialLogoX + 20;
  const finalLogoY = isReferenceStyle ? referenceLogoY + 14 : editorialLogoY + 14;
  const resizedLogo = await sharp(input.logoPath)
    .trim({ background: '#FFFFFF', threshold: 20 })
    .resize({ width: finalLogoWidth, height: finalLogoHeight, fit: 'contain', background: '#FFFFFF' })
    .flatten({ background: '#FFFFFF' })
    .png()
    .toBuffer();

  if (isWhiteArcStyle) {
    const scene = await sharp(input.scenePath)
      .resize(isStory ? dimensions.width : 540, isStory ? 990 : dimensions.height, {
        fit: input.sceneFit ?? 'cover',
        position: isStory ? 'centre' : 'right',
        background: '#FFFFFF'
      })
      .png()
      .toBuffer();
    const whiteCopyBounds = isStory
      ? { x: safe.left, y: 250, width: dimensions.width - safe.left - safe.right, height: 820 }
      : { x: safe.left, y: safe.top, width: 440, height: 720 };
    const headlineLines = editorialHeadlineLines(input.headline, input.format);
    const headlineSize = isStory ? 80 : 56;
    const headlineY = isStory ? 420 : 180;
    const bodyLines = wrapText(input.body, isStory ? 34 : 28).slice(0, 3);
    const bodyY = headlineY + headlineLines.length * (headlineSize - 5) + (isStory ? 56 : 42);
    const ctaY = isStory ? 820 : 700;
    const logoX = safe.left;
    const logoY = isStory ? 1395 : 850;
    const logoWidth = isStory ? 275 : 250;
    const logoHeight = isStory ? 145 : 130;
    const whiteArcSvg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .headlineBlue { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${headlineSize}px; font-weight: 900; fill: ${config.brand.palette.blue}; }
        .headlineInk { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${headlineSize}px; font-weight: 900; fill: ${ink}; }
        .body { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${isStory ? 34 : 29}px; font-weight: 600; fill: ${ink}; }
        .cta { font-family: 'Avenir Next', 'Helvetica Neue', Arial, sans-serif; font-size: ${isStory ? 31 : 28}px; font-weight: 800; fill: #FFFFFF; }
      </style>
      <path d="${isStory ? 'M0 930 C220 820 420 1070 650 950 C830 855 950 820 1080 850 L1080 955 C920 925 805 965 640 1045 C410 1155 210 930 0 1045 Z' : 'M0 900 C210 790 410 980 630 900 C820 830 945 805 1080 835 L1080 930 C920 900 800 950 630 1015 C405 1080 210 900 0 990 Z'}" fill="${config.brand.palette.blue}"/>
      <path d="${isStory ? 'M0 990 C220 885 420 1125 650 1005 C830 910 950 875 1080 905 L1080 955 C920 925 805 975 640 1050 C410 1160 210 950 0 1065 Z' : 'M0 965 C210 850 410 1035 630 960 C820 895 945 865 1080 895 L1080 930 C920 900 800 955 630 1020 C405 1090 210 920 0 1010 Z'}" fill="${config.brand.palette.cyan}" opacity="0.28"/>
      <path d="${isStory ? 'M0 0 C70 310 85 630 0 850' : 'M0 0 C100 260 90 500 0 730'}" fill="none" stroke="${config.brand.palette.blue}" stroke-width="${isStory ? 40 : 34}"/>
      <rect x="${safe.left}" y="${headlineY - headlineSize - 28}" width="${isStory ? 160 : 135}" height="10" rx="5" fill="${config.brand.palette.blue}"/>
      ${headlineLines.map((line, index) => `<text x="${safe.left}" y="${headlineY + index * (headlineSize - 5)}" class="${index % 2 === 0 ? 'headlineBlue' : 'headlineInk'}">${escapeXml(line)}</text>`).join('')}
      ${bodyLines.map((line, index) => `<text x="${safe.left}" y="${bodyY + index * (isStory ? 45 : 38)}" class="body">${escapeXml(line)}</text>`).join('')}
      <rect x="${safe.left}" y="${ctaY}" width="${isStory ? 610 : 410}" height="${isStory ? 84 : 76}" rx="${isStory ? 42 : 38}" fill="${config.brand.palette.blue}"/>
      <text x="${safe.left + (isStory ? 305 : 205)}" y="${ctaY + (isStory ? 55 : 50)}" text-anchor="middle" class="cta">${escapeXml(input.cta)}</text>
      <rect x="${logoX}" y="${logoY}" width="${logoWidth + 36}" height="${logoHeight + 24}" rx="18" fill="#FFFFFF"/>
    </svg>`;
    const whiteBase = sharp({ create: { width: dimensions.width, height: dimensions.height, channels: 3, background: '#FFFFFF' } });
    const whiteLayers = [
      { input: scene, top: isStory ? 930 : 0, left: isStory ? 0 : 540 },
      { input: Buffer.from(whiteArcSvg), top: 0, left: 0 },
      { input: resizedLogo, top: logoY + 12, left: logoX + 18 }
    ];
    await whiteBase.composite(whiteLayers).flatten({ background: '#FFFFFF' }).removeAlpha().png().toFile(input.outputPath);
    return { outputPath: input.outputPath, copyBounds: whiteCopyBounds, logoApplied: true };
  }

  const scene = isReferenceStyle
    ? await sharp(input.scenePath)
        .resize(isStory ? dimensions.width : 540, isStory ? 1120 : dimensions.height, { fit: 'cover', position: isStory ? 'centre' : 'right' })
        .png()
        .toBuffer()
    : undefined;
  const editorialScene = isReferenceStyle
    ? undefined
    : await sharp(input.scenePath)
        .resize(isStory ? dimensions.width : 540, isStory ? 990 : dimensions.height, {
          fit: input.sceneFit ?? 'cover',
          position: isStory ? 'centre' : 'right',
          background: '#FFFFFF'
        })
        .png()
        .toBuffer();
  const base = sharp({ create: { width: dimensions.width, height: dimensions.height, channels: 3, background: isReferenceStyle ? config.brand.palette.navy : ink } });
  const layers = isReferenceStyle
    ? [
        { input: scene!, top: isStory ? 800 : 0, left: isStory ? 0 : 540 },
        { input: Buffer.from(referenceSvg), top: 0, left: 0 },
        { input: resizedLogo, top: finalLogoY, left: finalLogoX }
      ]
    : [
        { input: editorialScene!, top: isStory ? 930 : 0, left: isStory ? 0 : 540 },
        { input: Buffer.from(editorialSvg), top: 0, left: 0 },
        { input: resizedLogo, top: finalLogoY, left: finalLogoX }
      ];
  await base
    .composite(layers)
    .flatten({ background: '#FFFFFF' })
    .removeAlpha()
    .png()
    .toFile(input.outputPath);

  return { outputPath: input.outputPath, copyBounds, logoApplied: true };
}
