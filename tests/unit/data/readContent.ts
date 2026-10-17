import { readFile } from 'node:fs/promises';
import path from 'node:path';

/** Lee un archivo real de `src/data/content/`. */
export function readContent(file: string): Promise<string> {
  return readFile(path.join('src/data/content', file), 'utf8');
}

/** Lee y convierte un JSON real de contenido. */
export async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readContent(file)) as unknown;
}
