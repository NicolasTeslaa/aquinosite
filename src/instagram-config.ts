import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface InstagramConfig {
  client: {
    name: string;
    instagramHandle: string;
    website: string;
  };
  schedule: {
    timezone: string;
    weekdays: string[];
    story: { time: string; format: string };
    feed: { time: string; format: string; automaticCaption: boolean; approvalRequired: boolean };
  };
  editorial: {
    weeklyTopicDay: string;
    missingWeeklyTopic: string;
    contentRestrictions: string[];
    referenceUrls: string[];
  };
  [key: string]: unknown;
}

export function loadInstagramConfig(path = resolve(process.cwd(), 'config/instagram.json')): InstagramConfig {
  return JSON.parse(readFileSync(path, 'utf8')) as InstagramConfig;
}

export function validateInstagramConfig(config: InstagramConfig): { valid: true } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  const weekdays: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  if (config.schedule.weekdays.some((day) => !weekdays.includes(day as Weekday))) {
    errors.push('schedule.weekdays may contain weekdays only');
  }
  if (config.schedule.feed.automaticCaption !== true) {
    errors.push('schedule.feed.automaticCaption must be true');
  }
  if (config.editorial.missingWeeklyTopic !== 'free_creation_from_references') {
    errors.push('editorial.missingWeeklyTopic must use free creation from references');
  }
  if ('smtp' in config || 'email' in config) {
    errors.push('email settings are not supported in this client workspace');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
