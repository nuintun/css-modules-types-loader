const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

module.exports = async function (content) {
  const ast = acorn.parse(content, {
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

  console.log('\n----------------------------------------------------------------');
  console.log(styles);
  console.log('----------------------------------------------------------------');

  fs.writeFile(path.resolve(`tests/dist/css.js`), content, error => {
    if (error) {
      return console.error(error);
    }
  });

  return content;
};
