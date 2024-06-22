/**
 * @module index
 */

import { schema } from './schema';
import { Options } from './interface';
import { generate, terminate } from './generate';
import { Compiler, LoaderDefinition } from 'webpack';

export { Options };

const initialized = new Set<Compiler>();

export default (function loader(content, sourceMap, additionalData) {
  const callback = this.async();
  const logger = this.getLogger(__NAME__);
  const options = this.getOptions(schema);

  const { _compiler: compiler } = this;

  if (compiler && !initialized.has(compiler)) {
    initialized.add(compiler);

    const teardown = () => {
      terminate().catch((error: Error) => {
        logger.error(error.message);
      });

      initialized.delete(compiler);
    };

    if (compiler.watchMode) {
      compiler.hooks.watchClose.tap(__NAME__, teardown);
    } else {
      compiler.hooks.done.tap(__NAME__, teardown);
    }
  }

  callback(null, content, sourceMap, additionalData);

  generate(`${this.resourcePath}.d.ts`, content, options).catch((error: Error) => {
    logger.error(error.message);
  });
} as LoaderDefinition<Options>);
