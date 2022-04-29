/**
 * @module generate
 */

import { expose } from 'threads';
import { Options } from '../schema';
import { generateTypings, removeFile, writeFile } from './utils';

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
