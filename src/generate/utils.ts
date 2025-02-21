/**
 * @module utils
 */

import { simple } from 'acorn-walk';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { AnyNode, Identifier, Literal, parse } from 'acorn';

type Mapping = Map<string, string>;

type Key = Identifier['name'] | Literal['value'];

type Collector = (key: string, value: string) => void;

/**
 * @function removeFile
 * @description Removes a file from the filesystem if it exists.
 * @param path The path to the file.
 */
export async function removeFile(path: string): Promise<void> {
  if (existsSync(path)) {
    await rm(path);
  }
}

/**
 * @function isString
 * @description Checks if a value is a string.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * @function collect
 * @description Collects styles from the given nodes and adds them to the styles array.
 * @param left The left node.
 * @param right The right node.
 * @param collector The collector function.
 */
export function collect(left: AnyNode, right: AnyNode, collector: Collector): void {
  if (right.type === 'Literal') {
    const value = right.value;

    if (isString(value)) {
      let key: Key;

      switch (left.type) {
        case 'Identifier':
          key = left.name;
          break;
        case 'Literal':
          key = left.value;
          break;
      }

      if (isString(key)) {
        collector(key, value);
      }
    }
  }
}

/**
 * @function parseStyles
 * @description Parses the styles from the given content.
 * @param content The content to parse the styles from.
 */
export function parseStyles(content: string): [named: boolean, styles: Mapping, reexports: Mapping] {
  let named = true;

  const ast = parse(content, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });

  const styles: Mapping = new Map();
  const reexports: Mapping = new Map();

  const collectStyles: Collector = (key, value) => {
    styles.set(key, value);
  };

  const collectReexports: Collector = (key, value) => {
    reexports.set(key, value);
  };

  simple(ast, {
    VariableDeclaration({ declarations }) {
      for (const { id, init } of declarations) {
        if (init) {
          collect(id, init, collectStyles);
        }
      }
    },
    AssignmentExpression({ left, right }) {
      if (left.type === 'MemberExpression') {
        const { property } = left;

        if (property.type === 'Identifier') {
          if (property.name === 'locals') {
            if (right.type === 'ObjectExpression') {
              named = false;

              simple(right, {
                Property({ key, value }) {
                  collect(key, value, collectStyles);
                }
              });
            }
          }
        }
      }
    },
    ExportNamedDeclaration({ specifiers }) {
      for (const { local, exported } of specifiers) {
        collect(local, exported, collectReexports);
      }
    }
  });

  return [named, styles, reexports];
}

/**
 * @function generateTypings
 * @description Generate typings for CSS modules.
 * @param content The CSS content.
 * @param banner Optional banner string.
 * @param eol End of line character.
 */
export function generateTypings(content: string, banner?: string, eol: string = `\n`): string | null {
  const [named, styles, reexports] = parseStyles(content);

  if (styles.size > 0) {
    const typings: string[] = banner ? [banner, ``] : [];

    if (named) {
      for (const [key, value] of styles) {
        if (reexports.has(key)) {
          typings.push(
            `declare const ${key}: ${JSON.stringify(value)};`,
            ``,
            `export { ${key} as ${reexports.get(key)} };`,
            ``
          );
        } else {
          typings.push(`export declare const ${key}: ${JSON.stringify(value)};`, ``);
        }
      }
    } else {
      typings.push(`declare const locals: {`);

      for (const [key, value] of styles) {
        typings.push(`  readonly ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
      }

      typings.push(`};`, ``, `export default locals;`, ``);
    }

    return typings.join(eol);
  }

  return null;
}
