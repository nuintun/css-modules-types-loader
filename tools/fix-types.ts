/**
 * @module fix-types
 */

import { resolvePaths } from 'dts-paths';

Promise.all([
  resolvePaths('cjs/rspack', {
    tsconfig: {
      extends: './tsconfig.json',
      compilerOptions: {
        rootDir: './cjs/rspack',
        paths: {
          '/*': ['./cjs/rspack/*']
        }
      }
    },
    mapSpecifier({ specifier }) {
      if (specifier === 'webpack') {
        return '@rspack/core';
      }

      return specifier;
    },
    mapExtension({ importer }) {
      return importer ? '.cjs' : '.cts';
    }
  }),
  resolvePaths('cjs/webpack', {
    tsconfig: {
      extends: './tsconfig.json',
      compilerOptions: {
        rootDir: './cjs/webpack',
        paths: {
          '/*': ['./cjs/webpack/*']
        }
      }
    },
    mapExtension({ importer }) {
      return importer ? '.cjs' : '.cts';
    }
  }),
  resolvePaths('esm/rspack', {
    tsconfig: {
      extends: './tsconfig.json',
      compilerOptions: {
        rootDir: './esm/rspack',
        paths: {
          '/*': ['./esm/rspack/*']
        }
      }
    },
    mapSpecifier({ specifier }) {
      if (specifier === 'webpack') {
        return '@rspack/core';
      }

      return specifier;
    }
  }),
  resolvePaths('esm/webpack', {
    tsconfig: {
      extends: './tsconfig.json',
      compilerOptions: {
        rootDir: './esm/webpack',
        paths: {
          '/*': ['./esm/webpack/*']
        }
      }
    }
  })
]).then(
  ([cjsRspack, cjsWebpack, esmRspack, esmWebpack]) => {
    console.log(`fix cjs rspack types: ${cjsRspack.size} files`);
    console.log(`fix cjs webpack types: ${cjsWebpack.size} files`);
    console.log(`fix esm rspack types: ${esmRspack.size} files`);
    console.log(`fix esm webpack types: ${esmWebpack.size} files`);
  },
  error => {
    console.error(error);
  }
);
