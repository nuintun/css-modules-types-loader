/**
 * @module schema
 */

import { LoaderContext } from 'webpack';

export default {
  type: 'object',
  properties: {
    eol: {
      type: 'string',
      description: 'Newline character in `*.d.ts` file. Use OS default. This option may be overridden by formatter option.'
    },
    banner: {
      type: 'string',
      description: 'To add a banner prefix to each `*.d.ts` file.'
    },
    formatter: {
      enum: ['prettier', 'none'],
      description: 'Formatter: none or prettier (require prettier installed). Defaults to prettier if prettier installed.'
    },
    prettierConfigFile: {
      type: 'string',
      description: 'Path to prettier config file.'
    }
  },
  additionalProperties: false
} as Parameters<LoaderContext<unknown>['getOptions']>[0];
