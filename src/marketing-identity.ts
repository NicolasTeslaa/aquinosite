import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

export function formatMarketingFilename(date: Date, slug: string, version: number, extension: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  const normalizedSlug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}_${normalizedSlug}_v${String(version).padStart(2, '0')}.${extension.replace(/^\./, '')}`;
}

export function sha256File(path: string | URL): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(path);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export function assertUniqueHash(hash: string, records: Array<{ hash: string }>): void {
  if (records.some((record) => record.hash === hash)) {
    throw new Error(`duplicate marketing asset hash: ${hash}`);
  }
}
