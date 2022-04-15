/**
 * @module generate
 */

import { parse } from 'acorn';
import { expose } from 'threads';

export interface Options {
  eol?: string;
  banner?: string;
  prettierConfigFile?: string;
  formatter?: 'none' | 'prettier';
}

export interface Generate {
  (path: string, content: string, options?: Options): void;
}

expose(function generate(path, content, options): void {
  const ast = parse(content, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });

  console.log(path, ast, options);
} as Generate);
