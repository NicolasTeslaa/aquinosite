import { appendMarketingRecord, readMarketingRecords, sanitizeApiError } from './marketing-log.ts';
import { assertUniqueHash } from './marketing-identity.ts';
import type { MarketingFormat } from './marketing-types.ts';
import type { PublishInput, PublishResult } from './publication-types.ts';

export interface ContainerInput {
  image_url: string;
  media_type: 'IMAGE' | 'STORIES';
  caption?: string;
}

export interface InstagramClient {
  createMediaContainer(input: ContainerInput): Promise<string>;
  publishMedia(containerId: string): Promise<{ id: string; permalink?: string }>;
}

function mediaType(format: MarketingFormat): ContainerInput['media_type'] {
  return format === 'story' ? 'STORIES' : 'IMAGE';
}

class GraphInstagramClient implements InstagramClient {
  private readonly token: string;
  private readonly endpoint = 'https://graph.instagram.com/me';

  constructor(token = process.env.INSTAGRAM_ACCESS_TOKEN ?? '') {
    if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN is required');
    this.token = token;
  }

  async createMediaContainer(input: ContainerInput): Promise<string> {
    const body = new URLSearchParams({ image_url: input.image_url, media_type: input.media_type, access_token: this.token });
    if (input.caption) body.set('caption', input.caption);
    const response = await fetch(`${this.endpoint}/media`, { method: 'POST', body });
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json() as { id?: string };
    if (!payload.id) throw new Error('Instagram did not return a media container id');
    return payload.id;
  }

  async publishMedia(containerId: string): Promise<{ id: string; permalink?: string }> {
    const body = new URLSearchParams({ creation_id: containerId, access_token: this.token });
    const response = await fetch(`${this.endpoint}/media_publish`, { method: 'POST', body });
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json() as { id?: string };
    if (!payload.id) throw new Error('Instagram did not return a published media id');
    const details = await fetch(`https://graph.instagram.com/${payload.id}?fields=id,permalink&access_token=${encodeURIComponent(this.token)}`);
    const detailPayload = details.ok ? await details.json() as { permalink?: string } : {};
    return { id: payload.id, permalink: detailPayload.permalink };
  }
}

export async function publishInstagram(input: PublishInput, client: InstagramClient = new GraphInstagramClient()): Promise<PublishResult> {
  const records = await readMarketingRecords(input.logPath);
  try {
    assertUniqueHash(input.hash, records.filter((record) => record.status === 'published' || record.status === 'duplicate'));
  } catch {
    const result: PublishResult = { status: 'duplicate', assetPath: input.assetPath, hash: input.hash, error: 'duplicate marketing asset hash' };
    await appendMarketingRecord(result, input.logPath);
    return result;
  }

  try {
    const containerId = await client.createMediaContainer({ image_url: input.imageUrl, media_type: mediaType(input.format), ...(input.caption ? { caption: input.caption } : {}) });
    const published = await client.publishMedia(containerId);
    const result: PublishResult = { status: 'published', assetPath: input.assetPath, hash: input.hash, mediaId: published.id, permalink: published.permalink };
    await appendMarketingRecord(result, input.logPath);
    return result;
  } catch (error) {
    const result: PublishResult = { status: 'failed', assetPath: input.assetPath, hash: input.hash, error: sanitizeApiError(error) };
    await appendMarketingRecord(result, input.logPath);
    return result;
  }
}
