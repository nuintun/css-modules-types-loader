/**
 * @module generate
 */

import { expose } from 'threads';
import { generateTypings, writeFile } from './utils';

export interface Options {
  eol?: string;
  banner?: string;
  prettierConfigFile?: string;
  formatter?: 'none' | 'prettier';
}

export interface Generate {
  (path: string, content: string, options?: Options): Promise<void>;
}

expose(function generate(path, content, options = {}) {
  return writeFile(path, generateTypings(content, options.banner, options.eol));
} as Generate);
