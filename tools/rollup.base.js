/**
 * @module rollup.base
 */

import { resolve } from 'path';
import pkg from '../package.json';
import treeShake from './plugins/tree-shake';
import replace from '@rollup/plugin-replace';
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
 * @function env
 * @param development
 */
function env(esnext) {
  return replace({
    preventAssignment: true,
    values: {
      __NAME__: JSON.stringify(pkg.name),
      __WORKER__: JSON.stringify(`./generate.${esnext ? 'js' : 'cjs'}`)
    }
  });
}

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
        format: esnext ? 'esm' : 'cjs',
        entryFileNames: `[name].${esnext ? 'js' : 'cjs'}`,
        chunkFileNames: `[name].${esnext ? 'js' : 'cjs'}`
      },
      external,
      plugins: [env(esnext), typescript(), treeShake()],
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
        dir: esnext ? 'esm/generate' : 'cjs/generate',
        entryFileNames: `[name].${esnext ? 'js' : 'cjs'}`,
        chunkFileNames: `[name].${esnext ? 'js' : 'cjs'}`
      },
      external,
      plugins: [env(esnext), typescript(), treeShake()],
      onwarn(error, warn) {
        if (error.code !== 'CIRCULAR_DEPENDENCY') {
          warn(error);
        }
      }
    }
  ];
}
