/**
 * @module generate
 */

import { Options } from '/interface';
import { writeFile } from 'fs/promises';
import { generateTypings, removeFile } from './utils';

export interface GenerateOptions extends Options {
  /**
   * @description The path to the typings file.
   */
  path: string;
  /**
   * @description The content of the typings file.
   */
  content: string;
}

export default async function generate({ eol, path, banner, content }: GenerateOptions): Promise<void> {
  const typings = generateTypings(content, banner, eol);

  if (typings) {
    await writeFile(path, typings);
  } else {
    await removeFile(path);
  }
}
