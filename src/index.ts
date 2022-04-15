/**
 * @module index
 */

import schema from './schema';
import pkg from '../package.json';
import { LoaderDefinitionFunction } from 'webpack';
import { generate, Options, terminate } from './generate';

export { Options };

export default (async function loader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const { _compiler: compiler } = this;
  const options = this.getOptions(schema);

  generate(`${this.resourcePath}.d.ts`, content, options);

  if (compiler && !compiler.watchMode) {
    compiler.hooks.done.tapAsync(pkg.name, (_stats, next) => {
      terminate();
      next();
    });
  }

  return content;
} as LoaderDefinitionFunction<Options>);
