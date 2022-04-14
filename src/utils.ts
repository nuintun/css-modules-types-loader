/**
 * @module utils
 */

import path from 'path';
import camelCase from 'camelcase';
import { parseSync } from '@swc/core';
import { asyncWalk } from 'estree-walker';
import { AssignmentExpression } from 'estree';

// const KEY_REGEX = /(["'])([^"'\\/;()\n]+)\1\s*:/g;
// const NAMED_KEY_REGEX = /export\s+(var|let|const)\s+(\w+)\s+=/g;

export function getCssModuleKeys(content: string | Buffer): [Record<string, string>, boolean] {
  if (Buffer.isBuffer(content)) {
    content = content.toString('utf-8');
  }

  let isNamedExport = false;

  const ast = parseSync(content, {
    comments: false,
    target: 'es2022',
    syntax: 'ecmascript'
  });

  const result: Record<string, string> = {};

  asyncWalk(ast, {
    async enter(node, parent) {}
  });

  return [result, isNamedExport];
}

export function filenameToPascalCase(filename: string): string {
  return camelCase(path.basename(filename), { pascalCase: true });
}

export function cssModuleToTypescriptInterfaceProperties(cssModuleKeys: string[], indent: string = '  '): string {
  return cssModuleKeys.map(key => `${indent}'${key}': string;`).join('\n');
}

export function filenameToTypingsFilename(filename: string): string {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);

  return path.join(dirName, `${baseName}.d.ts`);
}

export function generateGenericExportInterface(
  cssModuleKeys: string[],
  pascalCaseFileName: string,
  disableLocalsExport: boolean
): string {
  const interfaceName = `I${pascalCaseFileName}`;
  const moduleName = `${pascalCaseFileName}Module`;
  const namespaceName = `${pascalCaseFileName}Namespace`;

  const localsExportType = disableLocalsExport
    ? ``
    : ` & {
        // WARNING: Only available when \`css-loader\` is used without \`style-loader\` or \`mini-css-extract-plugin\`
        locals: ${namespaceName}.${interfaceName};
      }`;

  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys);

  return `
    declare namespace ${namespaceName} {
      export interface I${pascalCaseFileName} {
        ${interfaceProperties}
      }
    }

    declare const ${moduleName}: ${namespaceName}.${interfaceName}${localsExportType};

    export = ${moduleName};
  `;
}
