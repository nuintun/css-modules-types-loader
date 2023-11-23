/**
 * @module index
 */

import { Options } from '/interface';
import { Generate } from './generate';
import { Pool, spawn, Worker } from 'threads';

const pool = Pool(() => {
  return spawn<Generate>(new Worker(__WORKER__));
});

/**
 * @function terminate
 * @description Terminates the pool.
 * @param force If set to true, forcefully terminates the pool.
 */
export async function terminate(force?: boolean): Promise<void> {
  return pool.terminate(force);
}

/**
 * @function generate
 * @description Generates a file at the specified path with the provided content.
 * @param path The path where the file will be generated.
 * @param content The content of the file.
 * @param options Optional options for file generation.
 */
export async function generate(path: string, content: string | Buffer, options?: Options): Promise<void> {
  pool.queue(async generate => {
    await generate(path, content.toString(), options);
  });

  await pool.completed();
}
