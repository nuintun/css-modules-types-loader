const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');
const threads = require('threads');

threads.expose(function make(input) {
  const ast = acorn.parse(input, {
    sourceType: 'module',
    ecmaVersion: 'latest'
  });

  const styles = {};
  const simpleWalk = walk.simple;

  simpleWalk(ast, {
    ExpressionStatement(node) {
      simpleWalk(node, {
        AssignmentExpression(node) {
          if (node.left.property.name === 'locals') {
            simpleWalk(node, {
              Property(node) {
                styles[node.key.value] = node.value.value;
              }
            });
          }
        }
      });
    },
    ExportNamedDeclaration(node) {
      simpleWalk(node, {
        VariableDeclarator(node) {
          styles[node.id.name] = node.init.value;
        }
      });
    }
  });

  fs.writeFile(path.resolve(`tests/dist/styles.json`), JSON.stringify(styles, null, 2), error => {
    if (error) {
      return console.error(error);
    }
  });

  return styles;
});
