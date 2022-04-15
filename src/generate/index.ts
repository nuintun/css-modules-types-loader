/**
 * @module index
 */

import { Pool, spawn, Worker } from 'threads';
import { Generate, Options } from './generate';

export { Options };

const pool = Pool(() => {
  return spawn<Generate>(new Worker('./generate'));
});

export async function terminate(force?: boolean): Promise<void> {
  return pool.terminate(force);
}

export async function generate(path: string, content: string | Buffer, options?: Options): Promise<void> {
  pool.queue(async generate => {
    await generate(path, content.toString(), options);
  });

  await pool.completed();
}
