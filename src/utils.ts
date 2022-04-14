/**
 * @module utils
 */

import path from 'path';
import camelCase from 'camelcase';

// const KEY_REGEX = /(["'])([^"'\\/;()\n]+)\1\s*:/g;
// const NAMED_KEY_REGEX = /export\s+(var|let|const)\s+(\w+)\s+=/g;

export function getCssModuleKeys(content: string | Buffer): string[] {
  if (Buffer.isBuffer(content)) {
    content = content.toString('utf-8');
  }

  // let isNamedExport = false;
  // // check v4 / v5
  // let from = content.indexOf('___CSS_LOADER_EXPORT___.locals = {');

  let match: string[] | null;

  const keyRegex = /"([^"\n]+)":/g;
  const cssModuleKeys: string[] = [];

  while ((match = keyRegex.exec(content))) {
    if (!cssModuleKeys.includes(match[1])) {
      cssModuleKeys.push(match[1]);
    }
  }

  return cssModuleKeys;
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
