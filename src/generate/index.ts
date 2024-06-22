/**
 * @module index
 */

import { Piscina } from 'piscina';
import { GenerateOptions } from './generate';

const piscina = new Piscina<GenerateOptions, void>({
  filename: __WORKER__
});

/**
 * @function generate
 * @param options Optional options for file generation.
 */
export function generate(options: GenerateOptions): Promise<void> {
  return piscina.run(options);
}
