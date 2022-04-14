const fs = require('fs');
const path = require('path');

module.exports = async function (content) {
  const { type } = this.getOptions();

  fs.writeFile(path.resolve(`tests/dist/${type}.js`), content, error => {
    if (error) {
      return console.error(error);
    }

    console.log(`Write ${type}.js ok`);
  });

  return content;
};
