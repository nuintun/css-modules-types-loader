const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const swc = require('@swc/core');
const walk = require('acorn-walk');

module.exports = async function (content) {
  console.time('swc');
  for (let i = 0; i < 1000; i++) {
    const swcAst = await swc.parse(content, {
      comments: false,
      target: 'es2022',
      syntax: 'ecmascript'
    });
  }
  console.timeEnd('swc');

  // console.log(swcAst);

  console.time('acorn');
  for (let i = 0; i < 1000; i++) {
    const ast = acorn.parse(content, {
      sourceType: 'module',
      ecmaVersion: 'latest'
    });
  }
  console.timeEnd('acorn');

  // const keys = {};
  // const simpleWalk = walk.simple;

  // simpleWalk(ast, {
  //   ExpressionStatement(node) {
  //     simpleWalk(node, {
  //       AssignmentExpression(node) {
  //         if (node.left.property.name === 'locals') {
  //           simpleWalk(node, {
  //             Property(node) {
  //               keys[node.key.value] = node.value.value;
  //             }
  //           });
  //         }
  //       }
  //     });
  //   },
  //   ExportNamedDeclaration(node) {
  //     simpleWalk(node, {
  //       VariableDeclarator(node) {
  //         keys[node.id.name] = node.init.value;
  //       }
  //     });
  //   }
  // });

  // console.log('\n----------------------------------------------------------------');
  // console.log(keys);
  // console.log('----------------------------------------------------------------');

  fs.writeFile(path.resolve(`tests/dist/css.js`), content, error => {
    if (error) {
      return console.error(error);
    }
  });

  return content;
};
