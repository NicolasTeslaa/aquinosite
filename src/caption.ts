export interface CaptionInput {
  problem: string;
  benefit: string;
  cta: string;
  keywords: string[];
}

export function buildFeedCaption(input: CaptionInput): string {
  const keywords = input.keywords.filter(Boolean).join(', ');
  return `${input.problem} ${input.benefit} A AquiNoSite atua com ${keywords}. ${input.cta}`.replace(/\s+/g, ' ').trim();
}
