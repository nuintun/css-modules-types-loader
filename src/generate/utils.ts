/**
 * @module utils
 */

import fs from 'fs';
import { EOL } from 'os';
import acorn from 'acorn';
import { promisify } from 'util';
import { simple } from 'acorn-walk';
import { Identifier, Literal } from 'estree';

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

export function parse(content: string): [styles: Styles, named: boolean] {
  let named = false;

  const styles: Styles = [];

  const ast = acorn.parse(content, {
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
                  Property({ key: left, value: right }) {
                    const { value: key } = left as Literal;
                    const { value: value } = right as Literal;

                    if (isString(key) && isString(value)) {
                      styles.push([key, value]);
                    }
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
          const { name: key } = id as Identifier;
          const { value } = init as Literal;

          if (isString(key) && isString(value)) {
            styles.push([key, value]);
          }
        }
      });
    }
  });

  return [styles, named];
}

export function generateTypings(content: string, banner?: string, eol: string = EOL): string | null {
  const [styles, named] = parse(content);

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
