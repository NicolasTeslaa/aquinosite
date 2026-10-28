import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface MarketingRecord {
  assetPath: string;
  hash: string;
  status: string;
  [key: string]: unknown;
}

export async function appendMarketingRecord(record: MarketingRecord, logPath: string): Promise<void> {
  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify(record)}\n`, 'utf8');
}

export async function readMarketingRecords(logPath: string): Promise<MarketingRecord[]> {
  try {
    const content = await readFile(logPath, 'utf8');
    return content.split('\n').filter(Boolean).map((line) => JSON.parse(line) as MarketingRecord);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export function sanitizeApiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/(access_token|token|password)=([^\s&]+)/gi, '$1=[redacted]').slice(0, 500);
}
