import { describe, expect, it } from 'vitest';
import { checkDataPolicy, findPrices, parseFrontmatter } from '../../../scripts/validate-content';

describe('findPrices', () => {
  it.each([
    ['El curso cuesta $850.000', '$8'],
    ['Valor: 1.200.000 pesos', '1.200.000 pesos'],
    ['Precio en COP', 'COP'],
    ['{ "precio": 850000 }', '"precio": 8'],
    ['Solo 500 mil pesos', '500 mil pesos'],
  ])('detecta un precio en "%s"', (text, match) => {
    expect(findPrices('plans.json', text)).toEqual([{ file: 'plans.json', line: 1, match }]);
  });

  it.each([
    'Consultar precio',
    'Escríbenos y te enviamos el precio y las promociones vigentes.',
    'NIT 901722359-5 · Ley 1581 de 2012 · Decreto 1074 de 2015',
    'Teléfonos: 3246525153 – 3165641048',
    'Calle 13 # 10-96, Cereté · B1: 50 horas',
  ])('no confunde con un precio: "%s"', (text) => {
    expect(findPrices('contenido', text)).toEqual([]);
  });

  it('informa la línea del hallazgo', () => {
    expect(findPrices('faq.json', 'línea 1\nTotal $100')[0]?.line).toBe(2);
  });
});

describe('política de datos', () => {
  const approved = '---\nstatus: approved\nanalyticsSection: included\n---\n## 1. Texto';

  it('lee el frontmatter', () => {
    expect(parseFrontmatter(approved)).toEqual({
      status: 'approved',
      analyticsSection: 'included',
    });
  });

  it('acepta una política aprobada con analítica', () => {
    expect(checkDataPolicy(approved)).toEqual([]);
  });

  it('rechaza una política en borrador o sin analítica', () => {
    expect(checkDataPolicy('---\nstatus: draft\nanalyticsSection: pending\n---')).toHaveLength(2);
  });
});
