/**
 * @module parse
 */

import { parse } from 'acorn';
import { expose } from 'threads';

export interface Make {
  (input: string): void;
}

expose(function make(input) {
  parse(input, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });
} as Make);
