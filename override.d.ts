/**
 * @module override
 */

import { Compiler as ICompiler } from 'webpack';

declare module 'webpack' {
  declare class Compiler extends ICompiler {
    [key: symbol]: boolean;
  }
}
