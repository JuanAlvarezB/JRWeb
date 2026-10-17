import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { CANONICAL_ORIGIN } from '@/shared/constants/site';

describe('CANONICAL_ORIGIN', () => {
  it('coincide con la URL de PDN de .env.production', async () => {
    const env = await readFile('.env.production', 'utf8');
    const siteUrl = /^VITE_SITE_URL=(.+)$/mu.exec(env)?.[1]?.trim();
    expect(siteUrl).toBe(CANONICAL_ORIGIN);
  });
});
