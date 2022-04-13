/**
 * @module schema
 */

import { LoaderContext } from 'webpack';

export default {
  type: 'object',
  properties: {
    eol: {
      type: 'string',
      description:
        'Newline character to be used in generated d.ts files. Uses OS default. This option is overridden by the formatter option.'
    },
    banner: {
      type: 'string',
      description: "To add a 'banner' prefix to each generated `*.d.ts` file"
    },
    formatter: {
      enum: ['prettier', 'none'],
      description:
        'Possible options: none and prettier (requires prettier package installed). Defaults to prettier if `prettier` module can be resolved'
    },
    disableLocalsExport: {
      type: 'boolean',
      description: 'Disable the use of locals export. Defaults to `false`'
    },
    verifyOnly: {
      type: 'boolean',
      description: 'Validate generated `*.d.ts` files and fail if an update is needed (useful in CI). Defaults to `false`'
    },
    prettierConfigFile: {
      type: 'string',
      description: 'Path to prettier config file'
    }
  },
  additionalProperties: false
} as Parameters<LoaderContext<unknown>['getOptions']>[0];
