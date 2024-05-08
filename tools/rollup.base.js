/**
 * @module rollup.base
 */

import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake.js';
import { createRequire, isBuiltin } from 'module';
import typescript from '@rollup/plugin-typescript';

const pkg = createRequire(import.meta.url)('../package.json');

const externals = [
  // Dependencies
  ...Object.keys(pkg.dependencies || {}),
  // Peer dependencies
  ...Object.keys(pkg.peerDependencies || {})
];

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
 * @param {boolean} esnext
 * @return {import('rollup').Plugin}
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
 * @param {boolean} [esnext]
 * @return {import('rollup').RollupOptions[]}
 */
export default function rollup(esnext) {
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
      plugins: [env(esnext), typescript(), treeShake()],
      onwarn(error, warn) {
        if (error.code !== 'CIRCULAR_DEPENDENCY') {
          warn(error);
        }
      },
      external(source) {
        if (isBuiltin(source)) {
          return true;
        }

        for (const external of externals) {
          if (source === external || source.startsWith(`${external}/`)) {
            return true;
          }
        }

        return false;
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
      plugins: [env(esnext), typescript(), treeShake()],
      onwarn(error, warn) {
        if (error.code !== 'CIRCULAR_DEPENDENCY') {
          warn(error);
        }
      },
      external(source) {
        if (isBuiltin(source)) {
          return true;
        }

        for (const external of externals) {
          if (source === external || source.startsWith(`${external}/`)) {
            return true;
          }
        }

        return false;
      }
    }
  ];
}
