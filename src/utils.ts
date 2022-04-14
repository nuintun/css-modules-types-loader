/**
 * @module utils
 */

import path from 'path';
import camelCase from 'camelcase';

export function filenameToPascalCase(filename: string): string {
  return camelCase(path.basename(filename), { pascalCase: true });
}

export function filenameToTypingsFilename(filename: string): string {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);

  return path.join(dirName, `${baseName}.d.ts`);
}
