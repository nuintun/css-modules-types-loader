/**
 * @module schema
 */

import { LoaderContext } from 'webpack';

export default {
  type: 'object',
  properties: {
    banner: {
      type: 'string',
      description: 'To add a banner prefix to each `*.d.ts` file.'
    },
    eol: {
      type: 'string',
      description: 'Newline character in `*.d.ts` file. Use OS default. This option may be overridden by formatter option.'
    }
  },
  additionalProperties: false
} as Parameters<LoaderContext<unknown>['getOptions']>[0];
