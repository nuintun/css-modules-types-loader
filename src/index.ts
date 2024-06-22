/**
 * @module index
 */

import { schema } from './schema';
import { Options } from './interface';
import { generate, terminate } from './generate';
import { Compiler, LoaderDefinition } from 'webpack';

export { Options };

const name = __NAME__;
const initialized = Symbol(name);

declare class ICompiler extends Compiler {
  [initialized: symbol]: boolean;
}

export default (function loader(content, sourceMap, additionalData) {
  const callback = this.async();
  const logger = this.getLogger(name);
  const options = this.getOptions(schema);
  const compiler = this._compiler as ICompiler;

  if (compiler) {
    if (!compiler[initialized]) {
      compiler[initialized] = true;

      if (compiler.watchMode) {
        compiler.hooks.watchClose.tap(name, () => terminate());
      } else {
        compiler.hooks.done.tapPromise(name, () => terminate());
      }
    }
  }

  callback(null, content, sourceMap, additionalData);

  generate(`${this.resourcePath}.d.ts`, content, options).catch((error: Error) => {
    logger.error(error.message);
  });
} as LoaderDefinition<Options>);
