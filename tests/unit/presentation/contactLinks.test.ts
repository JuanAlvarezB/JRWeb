import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { toChannelLinks, toLocationView, toWhatsAppLink } from '@/presentation/hooks/contactLinks';
import { at, channels, location, whatsAppMessages } from '../domain/samples';

const textOf = (href: string): string | null => new URL(href).searchParams.get('text');

describe('toChannelLinks', () => {
  const links = toChannelLinks(channels, whatsAppMessages);

  it('WhatsApp abre el chat de cada número con el mensaje general', () => {
    const whatsApp = at(links, 0);
    expect(whatsApp.entries.map((entry) => entry.href)).toEqual([
      expect.stringMatching(/^https:\/\/wa\.me\/573165641048\?text=/),
      expect.stringMatching(/^https:\/\/wa\.me\/573246525153\?text=/),
    ]);
    expect(textOf(at(whatsApp.entries, 0).href)).toBe(whatsAppMessages.general);
    expect(at(whatsApp.entries, 0).external).toBe(true);
  });

  it('correo con mailto (misma pestaña) y redes con su URL (pestaña nueva)', () => {
    expect(at(at(links, 1).entries, 0)).toMatchObject({
      href: 'mailto:conducirdelsinu@gmail.com',
      external: false,
    });
    expect(at(at(links, 2).entries, 0)).toMatchObject({
      href: 'https://www.instagram.com/ceaconducirjrdelsinu/',
      display: '@ceaconducirjrdelsinu',
      external: true,
    });
  });

  it('el celular de llamadas usa tel: en la misma pestaña', () => {
    const [phone] = toChannelLinks(
      [{ kind: 'phone', label: 'Celular · llamadas', entries: [at(at(channels, 0).entries, 0)] }],
      whatsAppMessages,
    );
    expect(phone?.entries[0]).toMatchObject({ href: 'tel:+573165641048', external: false });
  });
});

describe('toWhatsAppLink', () => {
  it('sin consulta usa el número principal y el mensaje general', () => {
    const href = toWhatsAppLink(channels, whatsAppMessages);
    expect(href).toMatch(/^https:\/\/wa\.me\/573165641048\?/);
    expect(textOf(href)).toBe(whatsAppMessages.general);
  });

  it('la consulta de precio o requisitos lleva la categoría', () => {
    expect(
      textOf(toWhatsAppLink(channels, whatsAppMessages, { topic: 'price', category: 'B1' })),
    ).toBe('Hola, vi en la página web el curso B1 y quiero conocer el precio.');
    expect(
      textOf(toWhatsAppLink(channels, whatsAppMessages, { topic: 'requirements', category: 'C1' })),
    ).toBe('Hola, vi en la página web el curso C1 y quiero conocer los requisitos.');
  });

  it('sin canal de WhatsApp es un error del dominio', () => {
    expect(() => toWhatsAppLink(channels.slice(1), whatsAppMessages)).toThrow(NotFoundError);
  });
});

describe('toLocationView', () => {
  it('dirección en una línea e indicaciones por coordenadas', () => {
    const view = toLocationView(location);
    expect(view.fullAddress).toBe('Calle 13 # 10-96, Cereté, Córdoba, Colombia');
    expect(new URL(view.directionsUrl).searchParams.get('destination')).toBe(
      '8.8877998,-75.7887601',
    );
    expect(view.shortAddress).toBe('Calle 13 # 10-96, Cereté, Córdoba');
    expect(new URL(view.wazeUrl).searchParams.get('ll')).toBe('8.8877998,-75.7887601');
    expect(view.googleProfileUrl).toBe(location.googleProfileUrl);
  });

  it('sin coordenadas, indicaciones por dirección', () => {
    const withoutCoordinates = { ...location, coordinates: undefined };
    expect(
      new URL(toLocationView(withoutCoordinates).directionsUrl).searchParams.get('destination'),
    ).toBe('Calle 13 # 10-96, Cereté, Córdoba, Colombia');
    expect(new URL(toLocationView(withoutCoordinates).wazeUrl).searchParams.get('q')).toBe(
      'Calle 13 # 10-96, Cereté, Córdoba, Colombia',
    );
  });
});
