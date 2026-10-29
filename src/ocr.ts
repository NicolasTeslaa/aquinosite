import { createWorker } from 'tesseract.js';

export async function recognizePortugueseText(imagePath: string): Promise<string> {
  const worker = await createWorker('por');
  try {
    const result = await worker.recognize(imagePath);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}
