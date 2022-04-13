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
    disableLocalsExport: {
      type: 'boolean',
      description: 'Disable the use of locals export. Defaults to `false`.'
    },
    verifyOnly: {
      type: 'boolean',
      description: 'Validate `*.d.ts` files and fail if an update is needed (useful in CI). Defaults to `false`.'
    },
    prettierConfigFile: {
      type: 'string',
      description: 'Path to prettier config file.'
    }
  },
  additionalProperties: false
} as Parameters<LoaderContext<unknown>['getOptions']>[0];
