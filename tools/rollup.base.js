/**
 * @module rollup.base
 */

import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { createRequire, isBuiltin } from 'node:module';

const pkg = createRequire(import.meta.url)('../package.json');

const externals = [
  // Dependencies.
  ...Object.keys(pkg.dependencies || {}),
  // Peer dependencies.
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
 * @param {boolean} esnext Is esnext.
 * @return {import('rollup').Plugin}
 */
function env(esnext) {
  return replace({
    preventAssignment: true,
    values: {
      __NAME__: JSON.stringify(pkg.name),
      __WORKER__: esnext ? `new URL('./generate.js', import.meta.url).href` : `require.resolve('./generate.cjs')`
    }
  });
}

/**
 * @function rollup
 * @param {boolean} [esnext] Is esnext.
 * @return {import('rollup').RollupOptions}
 */
export default function rollup(esnext) {
  return {
    input: ['src/index.ts', 'src/generate/generate.ts'],
    output: {
      banner,
      interop: 'auto',
      preserveModules: true,
      dir: esnext ? 'esm' : 'cjs',
      format: esnext ? 'esm' : 'cjs',
      generatedCode: { constBindings: true },
      chunkFileNames: `[name].${esnext ? 'js' : 'cjs'}`,
      entryFileNames: `[name].${esnext ? 'js' : 'cjs'}`
    },
    plugins: [
      env(esnext),
      typescript({
        declaration: true,
        declarationDir: esnext ? 'esm' : 'cjs'
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
