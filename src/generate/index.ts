/**
 * @module index
 */

import { Generate } from './generate';
import { Pool, spawn, Worker } from 'threads';

export { Options } from './generate';

const pool = Pool(() => {
  return spawn<Generate>(new Worker('./generate'));
});

export const terminate = (force?: boolean): void => {
  pool.terminate(force);
};

export const generate: Generate = (path, content, options) => {
  pool.queue(async generate => {
    await generate(path, content, options);
  });
};
