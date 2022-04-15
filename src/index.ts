/**
 * @module index
 */

import schema from './schema';
import pkg from '../package.json';
import { LoaderDefinitionFunction } from 'webpack';
import { generate, Options, terminate } from './generate';

export { Options };

const initialized = Symbol(pkg.name);

export default (function loader(content) {
  if (this.cacheable) {
    this.cacheable(true);
  }

  const { _compiler: compiler } = this;
  const logger = this.getLogger(pkg.name);
  const options = this.getOptions(schema);

  generate(`${this.resourcePath}.d.ts`, content, options).catch((error: Error) => {
    logger.error(error.message);
  });

  if (compiler) {
    if (!compiler[initialized]) {
      compiler[initialized] = true;

      if (compiler.watchMode) {
        compiler.hooks.watchClose.tap(pkg.name, () => terminate());
      } else {
        compiler.hooks.done.tapPromise(pkg.name, () => terminate());
      }
    }
  }

  return content;
} as LoaderDefinitionFunction<Options>);
