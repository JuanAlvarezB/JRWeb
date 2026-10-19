import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { OG_IMAGE } from '@/presentation/seo/pageMeta';

/**
 * Imagen para compartir (`public/og-image.png`). WhatsApp descarta en la práctica las
 * imágenes de más de ~300 KB; el límite del proyecto es 250 KB para dejar margen.
 */
const MAX_BYTES = 250 * 1024;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const file = path.join('public', OG_IMAGE.path);

describe('og-image', () => {
  const bytes = readFileSync(file);

  it('es un PNG, como declara og:image:type', () => {
    expect(OG_IMAGE.type).toBe('image/png');
    expect([...bytes.subarray(0, PNG_SIGNATURE.length)]).toEqual(PNG_SIGNATURE);
  });

  it('mide 1200 × 630 px (1.91:1), igual que og:image:width y og:image:height', () => {
    // Cabecera IHDR del PNG: ancho y alto en los bytes 16–23.
    expect(bytes.readUInt32BE(16)).toBe(OG_IMAGE.width);
    expect(bytes.readUInt32BE(20)).toBe(OG_IMAGE.height);
    expect(OG_IMAGE.width).toBe(1200);
    expect(OG_IMAGE.height).toBe(630);
  });

  it('pesa máximo 250 KB', () => {
    expect(statSync(file).size).toBeLessThanOrEqual(MAX_BYTES);
  });
});
