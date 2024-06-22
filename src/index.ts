/**
 * @module index
 */

import { schema } from './schema';
import { Options } from './interface';
import { generate } from './generate';
import { LoaderDefinition } from 'webpack';

export { Options };

export default (function loader(content, sourceMap, additionalData) {
  const callback = this.async();
  const logger = this.getLogger(__NAME__);
  const path = `${this.resourcePath}.d.ts`;
  const { eol, banner } = this.getOptions(schema);

  callback(null, content, sourceMap, additionalData);

  generate({ eol, path, banner, content }).catch((error: Error) => {
    logger.error(error.message);
  });
} as LoaderDefinition<Options>);
