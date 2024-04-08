/**
 * @module schema
 */

import { Schema } from './interface';

export const schema: Schema = {
  type: 'object',
  properties: {
    banner: {
      type: 'string',
      description: 'To add a banner prefix to each `*.d.ts` file.'
    },
    eol: {
      type: 'string',
      description: 'Newline character in `*.d.ts` file. Use `\\n` by default.'
    }
  },
  additionalProperties: false
};
