/**
 * @module webpack
 */

import path from 'node:path';
import webpack from 'webpack';

const banner = `/**
 * @module css-modules-typings
 */`;

const compiler = webpack({
  name: 'react',
  mode: 'development',
  target: ['web', 'es5'],
  context: path.resolve('src'),
  entry: path.resolve('tests/src/index.js'),
  output: {
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
            test: /\.css$/,
            exclude: /[\\/]node_modules[\\/]/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-modules-types-loader',
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
  plugins: [new webpack.ProgressPlugin({ percentBy: 'entries' })]
});

compiler.run((error, stats) => {
  compiler.close(() => {
    if (error) {
      console.error(error);
    } else {
      console.log(stats.toString(compiler.options.stats));
    }
  });
});
