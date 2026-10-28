import { readMarketingRecords } from '../src/marketing-log.ts';
import { validateMarketingImage } from '../src/validate-marketing-image.ts';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const imagePath = arg('image');
const format = arg('format') as 'story' | 'feed' | undefined;
const logoApplied = arg('logo-applied') !== 'false';
const copyBounds = (arg('copy-bounds') ?? '100,300,880,1000').split(',').map(Number);
const logPath = arg('log') ?? 'logs/marketing/records.jsonl';

if (!imagePath || !format || copyBounds.length !== 4 || copyBounds.some(Number.isNaN)) {
  throw new Error('required arguments: --image, --format, and optional --copy-bounds=x,y,width,height');
}

const result = await validateMarketingImage({
  imagePath,
  format,
  logoApplied,
  copyBounds: { x: copyBounds[0], y: copyBounds[1], width: copyBounds[2], height: copyBounds[3] },
  hashRecords: (await readMarketingRecords(logPath)).filter((record) => record.status === 'published')
});

console.log(JSON.stringify(result, null, 2));
if (!result.valid) process.exitCode = 1;
