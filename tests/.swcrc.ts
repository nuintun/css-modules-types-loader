/**
 * @module .swcrc
 * @description Swc 配置
 */

import type { SwcLoaderOptions } from '@rspack/core';

/**
 * @function swcrc
 * @param mode 构建模式
 */
export default async (mode: string): Promise<SwcLoaderOptions> => {
  return {
    jsc: {
      externalHelpers: true,
      parser: {
        tsx: true,
        syntax: 'typescript'
      },
      transform: {
        react: {
          runtime: 'automatic',
          refresh: mode !== 'production'
        }
      }
    },
    env: {
      targets: ['defaults', 'not IE >= 0']
    },
    collectTypeScriptInfo: {
      typeExports: true,
      exportedEnum: true
    }
  };
};
