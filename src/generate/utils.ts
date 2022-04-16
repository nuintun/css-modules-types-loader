/**
 * @module utils
 */

import fs from 'fs';
import { EOL } from 'os';
import { parse } from 'acorn';
import { promisify } from 'util';
import { simple } from 'acorn-walk';
import { Identifier, Literal, Node } from 'estree';

export const rm = promisify(fs.rm);

export const writeFile = promisify(fs.writeFile);

export type Styles = [key: string, value: string][];

export async function removeFile(path: string): Promise<void> {
  if (fs.existsSync(path)) {
    await rm(path);
  }
}

export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

export function collect(styles: Styles, left: Node, right: Node): void {
  if (right.type === 'Literal') {
    const value = right.value;

    if (isString(value)) {
      let key: Identifier['name'] | Literal['value'];

      switch (left.type) {
        case 'Identifier':
          key = left.name;
          break;
        case 'Literal':
          key = left.value;
          break;
      }

      if (isString(key)) {
        styles.push([key, value]);
      }
    }
  }
}

export function parseStyles(content: string): [styles: Styles, named: boolean] {
  let named = false;

  const styles: Styles = [];

  const ast = parse(content, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });

  simple(ast, {
    ExpressionStatement(node) {
      simple(node, {
        AssignmentExpression({ left }) {
          if (left.type === 'MemberExpression') {
            const { property } = left;

            if (property.type === 'Identifier') {
              if (property.name === 'locals') {
                simple(node, {
                  Property({ key, value }) {
                    collect(styles, key, value);
                  }
                });
              }
            }
          }
        }
      });
    },
    ExportNamedDeclaration(node) {
      named = true;

      simple(node, {
        VariableDeclarator({ id, init }) {
          if (init) {
            collect(styles, id, init);
          }
        }
      });
    }
  });

  return [styles, named];
}

export function generateTypings(content: string, banner?: string, eol: string = EOL): string | null {
  const [styles, named] = parseStyles(content);

  if (styles.length > 0) {
    const typings: string[] = banner ? [banner, ''] : [];

    if (named) {
      for (const [key, value] of styles) {
        typings.push(`export const ${key}: ${JSON.stringify(value)};`);
      }
    } else {
      typings.push('declare const styles: {');

      for (const [key, value] of styles) {
        typings.push(`  ${key}: ${JSON.stringify(value)}`);
      }

      typings.push('};', '', 'export default styles;');
    }

    return typings.join(eol);
  }

  return null;
}
