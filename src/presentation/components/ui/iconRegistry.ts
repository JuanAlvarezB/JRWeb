import {
  ArrowRight,
  Award,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Star,
  Warehouse,
  X,
  type LucideIcon,
} from 'lucide-react';

/**
 * Íconos de línea de Lucide (licencia ISC). Trazo según DESIGN.md §6.
 * Solo se registran los que usa el sitio; así el paquete final no crece.
 */
export const LINE_ICONS = {
  arrowRight: ArrowRight,
  award: Award,
  camera: Camera,
  check: Check,
  chevronDown: ChevronDown,
  clock: Clock,
  copy: Copy,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  navigation: Navigation,
  phone: Phone,
  star: Star,
  warehouse: Warehouse,
  close: X,
} as const satisfies Record<string, LucideIcon>;

/** Glifo de marca de línea: una o varias rutas SVG en un lienzo de 24 × 24. */
export interface BrandGlyph {
  readonly paths: readonly string[];
}

/**
 * Íconos de marca, en estilo de línea como en los mockups (DESIGN.md §6).
 * Lucide 1.x ya no incluye íconos de marca, así que se registran aquí:
 * - WhatsApp: Tabler Icons "brand-whatsapp" (licencia MIT, © Paweł Kuna).
 * - Facebook e Instagram: geometría de las versiones previas de Lucide (licencia ISC).
 * - TikTok: nota de un solo trazo (círculo, tallo y bandera), dibujada para este sitio.
 */
export const BRAND_ICONS = {
  whatsapp: {
    paths: [
      'M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9',
      'M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1',
    ],
  },
  tiktok: { paths: ['M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5'] },
  facebook: {
    paths: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
  },
  instagram: {
    paths: [
      'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
      'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
      'M17.5 6.5h.01',
    ],
  },
} as const satisfies Record<string, BrandGlyph>;

export type LineIconName = keyof typeof LINE_ICONS;
export type BrandIconName = keyof typeof BRAND_ICONS;
export type IconName = LineIconName | BrandIconName;

/** Grosor de trazo de los íconos de línea (DESIGN.md §6: 1.75–2 px). */
export const ICON_STROKE_WIDTH = { regular: 1.75, bold: 2 } as const;

export function isBrandIcon(name: IconName): name is BrandIconName {
  return name in BRAND_ICONS;
}
