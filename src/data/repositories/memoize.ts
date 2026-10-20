/** Ejecuta `compute` una sola vez y reutiliza el resultado (el contenido no cambia). */
export function memoize<T>(compute: () => T): () => T {
  let cached: { value: T } | undefined;
  return () => {
    cached ??= { value: compute() };
    return cached.value;
  };
}
