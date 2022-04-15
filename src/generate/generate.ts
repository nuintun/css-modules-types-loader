/**
 * @module generate
 */

import { parse } from 'acorn';
import { writeFile } from 'fs';
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

  writeFile(path, JSON.stringify(ast, null, 2) + '\n\n' + JSON.stringify(options, null, 2), error => {
    if (error) {
      console.error(error);
    }
  });
} as Generate);
