/**
 * @module override
 */

import {
  AssignmentExpression,
  ExportNamedDeclaration,
  ExpressionStatement,
  Identifier,
  Literal,
  Property,
  VariableDeclarator
} from 'estree';
import { Compiler as ICompiler } from 'webpack';

declare module 'webpack' {
  export class Compiler extends ICompiler {
    [key: symbol]: boolean;
  }
}

declare module 'acorn-walk' {
  interface Visitors<TState> {
    Literal?(node: Literal, state: TState): void;
    Property?(node: Property, state: TState): void;
    Identifier?(node: Identifier, state: TState): void;
    VariableDeclarator?(node: VariableDeclarator, state: TState): void;
    ExpressionStatement?(node: ExpressionStatement, state: TState): void;
    AssignmentExpression?(node: AssignmentExpression, state: TState): void;
    ExportNamedDeclaration?(node: ExportNamedDeclaration, state: TState): void;
  }

  export function simple<TState = unknown, Node = unknown>(
    node: Node,
    visitors: Visitors<TState>,
    base?: RecursiveVisitors<TState>,
    state?: TState
  ): void;
}
