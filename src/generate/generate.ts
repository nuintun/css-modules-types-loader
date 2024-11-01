/**
 * @module generate
 */

import { Options } from '/interface';
import { writeFile } from 'node:fs/promises';
import { generateTypings, removeFile } from './utils';

const enum Action {
  REMOVE = 'remove',
  GENERATE = 'generate'
}

export interface Output {
  path: string;
  action: `${Action}`;
}

export interface GenerateOptions extends Options {
  /**
   * @description The path to the typings file.
   */
  path: string;
  /**
   * @description The content of the typings file.
   */
  content: string;
}

export default async function generate({ eol, path, banner, content }: GenerateOptions): Promise<Output> {
  const typings = generateTypings(content, banner, eol);

  if (typings) {
    await writeFile(path, typings);

    return { path, action: Action.GENERATE };
  }

  await removeFile(path);

  return { path, action: Action.REMOVE };
}
