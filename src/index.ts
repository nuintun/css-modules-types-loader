/**
 * @module index
 */

import { schema } from './schema';
import { Options } from './interface';
import { LoaderDefinition } from 'webpack';
import { generate, terminate } from './generate';

export { Options };

const name = __NAME__;
const initialized = Symbol(name);

export default (function loader(content, sourceMap, additionalData) {
  const callback = this.async();
  const logger = this.getLogger(name);
  const options = this.getOptions(schema);

  const { _compiler: compiler } = this;

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
