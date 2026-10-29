import { readMarketingRecords } from '../src/marketing-log.ts';
import { validateMarketingImage } from '../src/validate-marketing-image.ts';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const imagePath = arg('image');
const format = arg('format') as 'story' | 'feed' | undefined;
const expectedCopy = [arg('headline'), arg('body'), arg('cta'), 'AquiNoSite Saúde'].filter((value): value is string => Boolean(value));
const logPath = arg('log') ?? 'logs/marketing/records.jsonl';

if (!imagePath || !format || expectedCopy.length < 4) {
  throw new Error('required arguments: --image, --format, --headline, --body, and --cta');
}

const result = await validateMarketingImage({
  imagePath,
  format,
  expectedCopy,
  hashRecords: (await readMarketingRecords(logPath)).filter((record) => record.status === 'published')
});

console.log(JSON.stringify(result, null, 2));
if (!result.valid) process.exitCode = 1;
