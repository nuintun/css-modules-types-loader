/**
 * @module index
 */

import { Piscina } from 'piscina';
import { GenerateOptions, Output } from './generate';

const piscina = new Piscina<GenerateOptions, Output>({
  filename: __WORKER__
});

/**
 * @function generate
 * @param options Optional options for file generation.
 */
export function generate(options: GenerateOptions): Promise<Output> {
  return piscina.run(options);
}
