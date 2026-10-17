import { describe, expect, it } from 'vitest';
import {
  buildDirectionsLink,
  buildMailtoLink,
  buildTelLink,
  buildWhatsAppLink,
} from '@/shared/utils/links';

describe('buildWhatsAppLink', () => {
  it('usa wa.me con el número sin "+" y el mensaje codificado', () => {
    expect(buildWhatsAppLink('+573165641048', 'Hola, vi la página web & quiero info')).toBe(
      'https://wa.me/573165641048?text=Hola%2C+vi+la+p%C3%A1gina+web+%26+quiero+info',
    );
  });

  it('sin mensaje (o vacío) no agrega el parámetro', () => {
    expect(buildWhatsAppLink('+573165641048')).toBe('https://wa.me/573165641048');
    expect(buildWhatsAppLink('+57 316 564 1048', '')).toBe('https://wa.me/573165641048');
  });
});

describe('buildTelLink y buildMailtoLink', () => {
  it('conservan el "+" del número y quitan los espacios', () => {
    expect(buildTelLink('+57 316 564 1048')).toBe('tel:+573165641048');
  });

  it('arma el mailto del correo', () => {
    expect(buildMailtoLink('conducirdelsinu@gmail.com')).toBe('mailto:conducirdelsinu@gmail.com');
  });
});

describe('buildDirectionsLink', () => {
  it('usa la acción de indicaciones de Google Maps', () => {
    const url = new URL(buildDirectionsLink('8.8877998,-75.7887601'));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('destination')).toBe('8.8877998,-75.7887601');
  });

  it('acepta una dirección en texto', () => {
    expect(
      new URL(buildDirectionsLink('Calle 13 # 10-96, Cereté')).searchParams.get('destination'),
    ).toBe('Calle 13 # 10-96, Cereté');
  });
});
