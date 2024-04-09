/**
 * @module override
 */

import webpack from 'webpack';

declare module 'webpack' {
  declare class Compiler extends webpack.Compiler {
    [key: symbol]: boolean;
  }
}
