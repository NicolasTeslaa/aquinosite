import { runContentSlot } from '../src/content-slot.ts';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const channel = arg('channel') as 'story' | 'feed' | undefined;
const imagePath = arg('image');
const scheduledAt = arg('scheduled-at');
const slug = arg('slug');
const headline = arg('headline');
const body = arg('body');
const cta = arg('cta') ?? 'Fale com a AquiNoSite';
const imageUrl = arg('image-url');
const caption = arg('caption');
const dryRun = process.argv.includes('--dry-run');
const outputDir = arg('output-dir');
const logPath = arg('log');

if (!channel || !imagePath || !scheduledAt || !slug || !headline || !body) throw new Error('required arguments: --channel, --image, --scheduled-at, --slug, --headline, --body');

const result = await runContentSlot({
  channel,
  scheduledAt: new Date(scheduledAt),
  imagePath,
  outputDir,
  logPath,
  imageUrl,
  caption,
  publish: dryRun ? false : undefined,
  brief: { slug, headline, body, cta }
});

console.log(JSON.stringify(result, null, 2));
