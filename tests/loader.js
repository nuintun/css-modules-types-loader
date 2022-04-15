const fs = require('fs');
const path = require('path');
const threads = require('threads');

const thread = threads.Pool(() => threads.spawn(new threads.Worker('./worker')));

module.exports = async function (content) {
  thread.queue(make => {
    make(content).then(styles => {
      console.log(styles);
    });
  });

  fs.writeFile(path.resolve(`tests/dist/css.js`), content, error => {
    if (error) {
      return console.error(error);
    }
  });

  const { _compiler: compiler } = this;

  if (compiler && !compiler.watchMode) {
    compiler.hooks.done.tapAsync('css-modules-types-loader', (_stats, next) => {
      thread.terminate(true);

      next();
    });
  }

  return content;
};
