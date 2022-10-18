/**
 * @module rollup.base
 */

import { resolve } from 'path';
import { createRequire } from 'module';
import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake.js';
import typescript from '@rollup/plugin-typescript';

const pkg = createRequire(import.meta.url)('../package.json');

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
      output: {
        banner,
        interop: 'auto',
        exports: 'auto',
        esModule: false,
        preserveModules: true,
        dir: esnext ? 'esm' : 'cjs',
        format: esnext ? 'esm' : 'cjs',
        generatedCode: { constBindings: true },
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
      output: {
        banner,
        interop: 'auto',
        exports: 'auto',
        esModule: false,
        preserveModules: true,
        format: esnext ? 'esm' : 'cjs',
        generatedCode: { constBindings: true },
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
