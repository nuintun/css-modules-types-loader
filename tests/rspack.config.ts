/**
 * @module webpack
 */

import path from 'node:path';
import swcrc from './.swcrc.ts';
import rspack from '@rspack/core';

const mode = 'production';

const banner = `/**
 * @module css-modules-typings
 */`;

const swcOptions = await swcrc(mode);

const compiler = rspack({
  mode,
  name: 'react',
  target: ['web', 'es5'],
  context: path.resolve('tests/src'),
  entry: path.resolve('tests/src/index.ts'),
  output: {
    clean: true,
    publicPath: '/dist/',
    filename: `[name].js`,
    chunkFilename: `[name].js`,
    path: path.resolve('tests/dist'),
    assetModuleFilename: `[path][name][ext]`
  },
  resolve: {
    fallback: { url: false }
  },
  stats: {
    all: false,
    assets: true,
    colors: true,
    errors: true,
    timings: true,
    version: true,
    warnings: true,
    errorsCount: true,
    warningsCount: true,
    groupAssetsByPath: true
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.[jt]sx?$/i,
            exclude: /[\\/]node_modules[\\/]/,
            use: [
              {
                loader: 'builtin:swc-loader',
                options: swcOptions
              }
            ]
          },
          {
            test: /\.css$/i,
            exclude: /[\\/]node_modules[\\/]/,
            use: [
              {
                loader: rspack.CssExtractRspackPlugin.loader
              },
              {
                loader: 'css-modules-types-loader/rspack',
                options: {
                  banner
                }
              },
              {
                loader: 'css-loader',
                options: {
                  esModule: true,
                  modules: {
                    auto: true,
                    namedExport: true,
                    localIdentName: '[local]-[hash:8]',
                    exportLocalsConvention: 'camel-case-only'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new rspack.ProgressPlugin({
      progressChars: '█▒',
      prefix: 'css-modules-typings',
      template: '<i> {prefix:.cyan.bold} {bar:25.green/white.dim} ({percent}%) {wide_msg:.dim}'
    }),
    new rspack.CssExtractRspackPlugin({
      ignoreOrder: true,
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    })
  ]
});

compiler.run((error, stats) => {
  compiler.close(() => {
    if (error) {
      console.error(error);
    } else {
      console.log(stats?.toString(compiler.options.stats));
    }
  });
});
