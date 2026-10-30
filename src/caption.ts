import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface CaptionInput {
  problem: string;
  benefit: string;
  cta: string;
  keywords: string[];
}

interface ContactConfig {
  phone: string;
  instagram: string;
  website: string;
  email: string;
}

const defaultContactPath = resolve(process.cwd(), 'config/contato.json');

export function loadContact(path = defaultContactPath): ContactConfig {
  return JSON.parse(readFileSync(path, 'utf8')) as ContactConfig;
}

export function buildFeedCaption(input: CaptionInput): string {
  const keywords = input.keywords.filter(Boolean).join(', ');
  const contact = loadContact();
  return `${input.problem} ${input.benefit} A AquiNoSite atua com ${keywords}. ${input.cta} Telefone: ${contact.phone}. Instagram: ${contact.instagram}. ${contact.website}. ${contact.email}.`.replace(/\s+/g, ' ').trim();
}
