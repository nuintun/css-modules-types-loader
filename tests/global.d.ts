/**
 * @module global
 */

/// <reference types="@rspack/core/module" />

declare module '*.module.css' {
  const content: {
    readonly [name: string]: string;
  };

  export = content;
}

declare module '*.css' {
  const content: string;

  export = content;
}
