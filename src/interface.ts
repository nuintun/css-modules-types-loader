/**
 * @module interface
 */

import { LoaderContext } from 'webpack';

export interface Options {
  eol?: string;
  banner?: string;
}

export type Schema = Parameters<LoaderContext<Options>['getOptions']>[0];
