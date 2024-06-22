/**
 * @module interface
 */

import { LoaderContext } from 'webpack';

export interface Options {
  /**
   * @description The end of line character.
   */
  eol?: string;
  /**
   * @description The banner string.
   */
  banner?: string;
}

export type Schema = Parameters<LoaderContext<Options>['getOptions']>[0];
