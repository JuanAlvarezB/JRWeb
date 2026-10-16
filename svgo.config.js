/**
 * Optimización de los SVG de marca (public/assets/). Conserva viewBox, título
 * e IDs (el degradado del auto y la aguja del velocímetro dependen de ellos).
 *
 * @type {import('svgo').Config}
 */
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { cleanupIds: false } },
    },
  ],
};
