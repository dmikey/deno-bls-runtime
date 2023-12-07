import { resolve } from  "https://deno.land/std/path/mod.ts";
import { dynamicImport } from 'https://deno.land/x/import/mod.ts';

export async function executeScript(filePath: string): Promise<void> {
  return dynamicImport(await resolve(filePath));
}
