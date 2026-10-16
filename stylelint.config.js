/**
 * Stylelint: los CSS Modules solo pueden usar las variables generadas desde
 * design-tokens/tokens.json (DESIGN.md). Se prohíben colores, tamaños y familias
 * de fuente, pesos, sombras y radios escritos directamente.
 *
 * @type {import('stylelint').Config}
 */
const TOKEN = '/^var\\(--[a-z0-9-]+\\)$/';
const TOKEN_EXPRESSION = '/^(calc|clamp|min|max)\\(.*var\\(--/';

export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-value-no-unknown-custom-properties'],
  ignoreFiles: ['src/styles/variables.css', 'dist/**', 'coverage/**', 'node_modules/**'],
  rules: {
    // Colores: nada de hex, nombres ni funciones de color.
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
    ],

    // Tipografía, sombras y radios: solo variables.
    'declaration-property-value-allowed-list': [
      {
        'font-size': [TOKEN, TOKEN_EXPRESSION, 'inherit'],
        'font-family': [TOKEN, 'inherit'],
        'font-weight': [TOKEN, 'inherit'],
        'line-height': [TOKEN, 'inherit', '1'],
        'letter-spacing': [TOKEN, 'inherit', '0'],
        'box-shadow': [TOKEN, '/^var\\(--[a-z0-9-]+\\), *var\\(--[a-z0-9-]+\\)$/', 'none'],
        'text-shadow': ['none'],
        '/^border(-(top|bottom)-(left|right))?-radius$/': [TOKEN, '0', '50%', 'inherit'],
        'transition-duration': [TOKEN, '0s'],
        'animation-duration': [TOKEN, '0s'],
      },
      {
        message: (property, value) =>
          `"${property}: ${value}" debe usar una variable de DESIGN.md (src/styles/variables.css).`,
      },
    ],
    'declaration-property-value-disallowed-list': [
      {
        font: ['/\\d/'],
        transition: ['/\\d+m?s/'],
        animation: ['/\\d+m?s/'],
      },
      { message: 'Usa las variables de movimiento y tipografía de DESIGN.md.' },
    ],

    // Solo variables que existan en variables.css (evita nombres mal escritos).
    'csstools/value-no-unknown-custom-properties': [
      true,
      { importFrom: ['src/styles/variables.css'] },
    ],

    // Un único punto de quiebre (DESIGN.md §4): móvil < 720 px ≤ escritorio.
    'media-feature-name-value-allowed-list': [
      { '/^(min-|max-)?width$/': ['720px'] },
      { message: 'El único punto de quiebre de DESIGN.md es 720px: usa (width >= 720px).' },
    ],

    // CSS Modules
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Las clases de CSS Modules van en camelCase (ej. .primaryButton).' },
    ],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
  },
};
