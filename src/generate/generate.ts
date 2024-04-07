/**
 * @module generate
 */

import { expose } from 'threads';
import { Options } from '/interface';
import { writeFile } from 'fs/promises';
import { generateTypings, removeFile } from './utils';

/**
 * @function generate
 * @description Generate typings for CSS modules and write them to a file.
 * @param path The path to the file.
 * @param content The CSS content.
 * @param options Optional options for generating typings.
 */
export interface Generate {
  (path: string, content: string, options?: Options): Promise<void>;
}

expose(function generate(path, content, { banner, eol } = {}) {
  const typings = generateTypings(content, banner, eol);

  if (typings) {
    return writeFile(path, typings);
  }

  return removeFile(path);
} as Generate);
