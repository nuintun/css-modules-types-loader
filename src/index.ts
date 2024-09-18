/**
 * @module index
 */

import { schema } from './schema';
import { Options } from './interface';
import { generate } from './generate';
import { LoaderDefinition } from 'webpack';

export { Options };

/**
 * @function loader
 */
const loader: LoaderDefinition<Options> = function (content, sourceMap, additionalData) {
  const callback = this.async();
  const logger = this.getLogger(__NAME__);
  const path = `${this.resourcePath}.d.ts`;
  const { eol, banner } = this.getOptions(schema);

  callback(null, content, sourceMap, additionalData);

  generate({ eol, path, banner, content }).then(
    output => {
      logger.log(`${output.action} ${output.path}`);
    },
    error => {
      logger.error(error.message);
    }
  );
};

export default loader;
