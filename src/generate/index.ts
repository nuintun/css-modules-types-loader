/**
 * @module index
 */

import { Options } from '/interface';
import { Generate } from './generate';
import { Pool, spawn, Worker } from 'threads';

const pool = Pool(() => {
  return spawn<Generate>(new Worker(__WORKER__));
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
