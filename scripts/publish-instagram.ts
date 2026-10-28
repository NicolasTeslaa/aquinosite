import { sha256File } from '../src/marketing-identity.ts';
import { publishInstagram } from '../src/instagram-publisher.ts';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const assetPath = arg('asset');
const imageUrl = arg('image-url');
const format = arg('format') as 'story' | 'feed' | undefined;
const caption = arg('caption');
const logPath = arg('log') ?? 'logs/marketing/records.jsonl';

if (!assetPath || !imageUrl || !format) throw new Error('required arguments: --asset, --image-url, and --format');
const result = await publishInstagram({ assetPath, imageUrl, format, caption, hash: await sha256File(assetPath), logPath });
console.log(JSON.stringify(result, null, 2));
if (result.status === 'failed' || result.status === 'duplicate') process.exitCode = 1;
