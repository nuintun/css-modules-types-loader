/**
 * @module index
 */

// https://github.com/Megaputer/dts-css-modules-loader
// https://github.com/kagawagao/css-modules-typings-loader

import schema from './schema';
import { LoaderDefinitionFunction } from 'webpack';

interface Options {
  eol?: string;
  banner?: string;
  verifyOnly?: boolean;
  prettierConfigFile?: string;
  disableLocalsExport?: boolean;
  formatter?: 'none' | 'prettier';
}

export default (async function loader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const options = this.getOptions(schema);

  console.log(options);

  return content;
} as LoaderDefinitionFunction<Options>);
