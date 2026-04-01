/**
 * @module rollup.base
 */

import { isBuiltin } from 'node:module';
import type { RollupOptions } from 'rollup';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import pkg from '../package.json' with { type: 'json' };

const externals = [
  // @ts-ignore
  // dependencies
  ...Object.keys(pkg.dependencies ?? {}),
  // @ts-ignore
  // peer dependencies
  ...Object.keys(pkg.peerDependencies ?? {})
];

const banner = `/**
 * @module css-modules-types-loader
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
 * @description replace environment variables
 * @param {boolean} esnext is esnext
 */
function env(esnext: boolean) {
  return replace({
    preventAssignment: true,
    values: {
      __NAME__: JSON.stringify(pkg.name),
      __WORKER__: esnext
        ? `new URL('./generate.js', import.meta.url).href`
        : `require.resolve('./generate.cjs')`
    }
  });
}

/**
 * @function createConfig
 * @description create rollup configuration
 * @param esnext is esnext
 * @param bundler bundler name
 */
function createConfig(esnext: boolean, bundler: string): RollupOptions {
  const root = esnext ? 'esm' : 'cjs';

  return {
    input: ['src/index.ts', 'src/generate/generate.ts'],
    output: {
      banner,
      interop: 'auto',
      exports: 'named',
      esModule: false,
      preserveModules: true,
      dir: `${root}/${bundler}`,
      format: esnext ? 'esm' : 'cjs',
      generatedCode: { constBindings: true },
      entryFileNames: `[name].${esnext ? 'js' : 'cjs'}`,
      chunkFileNames: `[name].${esnext ? 'js' : 'cjs'}`
    },
    plugins: [
      env(esnext),
      typescript({
        declaration: true,
        declarationDir: `${root}/${bundler}`,
        include: ['../src/**/*', '../global.d.ts']
      })
    ],
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
  };
}

/**
 * @function rollup
 * @description rollup configuration
 * @param {boolean} [esnext] is esnext
 */
export default function rollup(esnext = false): RollupOptions[] {
  return [createConfig(esnext, 'rspack'), createConfig(esnext, 'webpack')];
}
