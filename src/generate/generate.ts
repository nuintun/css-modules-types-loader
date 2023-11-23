/**
 * @module generate
 */

import { expose } from 'threads';
import { Options } from '/interface';
import { generateTypings, removeFile, writeFile } from './utils';

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

expose(async function generate(path, content, options = {}) {
  const typings = generateTypings(content, options.banner, options.eol);

  if (typings) {
    return writeFile(path, typings);
  } else {
    return removeFile(path);
  }
} as Generate);
