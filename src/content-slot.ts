import { access, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { composeMarketingImage } from './compose-marketing-image.ts';
import { loadMarketingConfig } from './marketing-config.ts';
import { formatMarketingFilename, sha256File } from './marketing-identity.ts';
import { appendMarketingRecord, readMarketingRecords } from './marketing-log.ts';
import { publishInstagram, type InstagramClient } from './instagram-publisher.ts';
import type { MarketingFormat } from './marketing-types.ts';
import type { PublishResult } from './publication-types.ts';
import { validateMarketingImage } from './validate-marketing-image.ts';

export interface SlotBrief {
  slug: string;
  headline: string;
  body: string;
  cta: string;
}

export interface SlotInput {
  channel: MarketingFormat;
  scheduledAt: Date;
  scenePath: string;
  outputDir?: string;
  logPath?: string;
  imageUrl?: string;
  brief: SlotBrief;
  caption?: string;
  publish?: boolean;
  client?: InstagramClient;
}

export interface SlotResult {
  assetPath: string;
  hash: string;
  generation: { status: 'generated'; validation: { valid: true; hash: string } };
  publication?: PublishResult;
}

function localSlot(date: Date): { weekday: string; time: string } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { weekday: values.weekday, time: `${values.hour}:${values.minute}` };
}

function expectedTime(channel: MarketingFormat): string {
  return channel === 'story' ? '09:00' : '15:00';
}

async function nextOutputPath(outputDir: string, scheduledAt: Date, slug: string): Promise<string> {
  for (let version = 1; version < 100; version += 1) {
    const name = formatMarketingFilename(scheduledAt, slug, version, 'png');
    const path = join(outputDir, name);
    try { await access(path); } catch { return path; }
  }
  throw new Error('could not allocate a marketing filename version');
}

export async function runContentSlot(input: SlotInput): Promise<SlotResult> {
  const slot = localSlot(input.scheduledAt);
  if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(slot.weekday)) throw new Error('slot must be scheduled on a weekday');
  if (slot.time !== expectedTime(input.channel)) throw new Error(`slot must run at ${expectedTime(input.channel)} Sao Paulo time`);

  const config = loadMarketingConfig();
  const outputDir = resolve(input.outputDir ?? 'assets/marketing');
  const logPath = resolve(input.logPath ?? 'logs/marketing/records.jsonl');
  await mkdir(outputDir, { recursive: true });
  const outputPath = await nextOutputPath(outputDir, input.scheduledAt, input.brief.slug);
  const logoPath = resolve(config.brand.logoPath);
  const composed = await composeMarketingImage({ ...input.brief, scenePath: input.scenePath, outputPath, format: input.channel, logoPath });
  const records = await readMarketingRecords(logPath);
  const validation = await validateMarketingImage({ imagePath: outputPath, format: input.channel, logoApplied: composed.logoApplied, copyBounds: composed.copyBounds, hashRecords: records.filter((record) => record.status === 'published') });
  if (!validation.valid) throw new Error(`marketing image validation failed: ${validation.errors.join('; ')}`);

  const hash = await sha256File(outputPath);
  await appendMarketingRecord({ assetPath: outputPath, hash, channel: input.channel, status: 'generated', generatedAt: input.scheduledAt.toISOString() }, logPath);
  if (input.publish === false) return { assetPath: outputPath, hash, generation: { status: 'generated', validation } };
  if (!input.imageUrl) throw new Error('imageUrl is required when publication is enabled');
  const publication = await publishInstagram({ assetPath: outputPath, imageUrl: input.imageUrl, hash, format: input.channel, caption: input.channel === 'feed' ? input.caption : undefined, logPath }, input.client);
  return { assetPath: outputPath, hash, generation: { status: 'generated', validation }, publication };
}
