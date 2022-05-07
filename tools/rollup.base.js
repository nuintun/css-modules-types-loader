/**
 * @module rollup.base
 */

import { resolve } from 'path';
import pkg from '../package.json';
import treeShake from './plugins/tree-shake';
import typescript from '@rollup/plugin-typescript';

const banner = `/**
  * @package ${pkg.name}
  * @license ${pkg.license}
  * @version ${pkg.version}
  * @author ${pkg.author.name} <${pkg.author.email}>
  * @description ${pkg.description}
  * @see ${pkg.homepage}
  */
 `;

/**
 * @function rollup
 * @param esnext
 * @param development
 */
export default function rollup(esnext) {
  const external = [
    'fs',
    'os',
    'util',
    'path',
    'acorn',
    'tslib',
    'estree',
    'threads',
    'prettier',
    'acorn-walk',
    resolve('package.json')
  ];

  return [
    {
      input: 'src/index.ts',
      preserveModules: true,
      output: {
        banner,
        interop: false,
        exports: 'auto',
        esModule: false,
        preferConst: true,
        dir: esnext ? 'esm' : 'cjs',
        format: esnext ? 'esm' : 'cjs'
      },
      external,
      plugins: [typescript(), treeShake()],
      onwarn(error, warn) {
        if (error.code !== 'CIRCULAR_DEPENDENCY') {
          warn(error);
        }
      }
    },
    {
      input: 'src/generate/generate.ts',
      preserveModules: true,
      output: {
        banner,
        interop: false,
        exports: 'auto',
        esModule: false,
        preferConst: true,
        format: esnext ? 'esm' : 'cjs',
        dir: esnext ? 'esm/generate' : 'cjs/generate'
      },
      external,
      plugins: [typescript(), treeShake()],
      onwarn(error, warn) {
        if (error.code !== 'CIRCULAR_DEPENDENCY') {
          warn(error);
        }
      }
    }
  ];
}
