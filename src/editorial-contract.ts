import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface EditorialBrief {
  theme: 'education' | 'context' | 'confidence' | 'product' | 'institutional' | 'assistance';
  text: string;
  productSlug?: string;
}

export interface EditorialSources {
  catalogPath?: string;
}

export type EditorialValidationResult = { valid: true } | { valid: false; errors: string[] };
export type ProductValidationResult = { valid: true; product: { name: string; path: string } } | { valid: false; errors: string[] };

const unsupportedClaims = /\b(garante|garantido|cura|curar|trata|tratar|resultado certo|sem risco)\b/i;

export function validateEditorialBrief(brief: EditorialBrief): EditorialValidationResult {
  if (unsupportedClaims.test(brief.text)) {
    return { valid: false, errors: ['brief contains an unsupported medical or guaranteed-result claim'] };
  }
  if (brief.theme === 'product' && !brief.productSlug) {
    return { valid: false, errors: ['product briefs require a catalog product'] };
  }
  return { valid: true };
}

export function validateProductReference(productSlug: string, catalogPath = resolve(process.cwd(), 'config/catalogo-produtos.json')): ProductValidationResult {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as { homepageProductsChecked?: Array<{ name: string; path: string }> };
  const product = catalog.homepageProductsChecked?.find((item) => item.path.replace(/^\//, '') === productSlug);
  return product ? { valid: true, product } : { valid: false, errors: ['product is not present in the official catalog'] };
}
