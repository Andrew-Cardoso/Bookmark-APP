const path = require('path');

module.exports = {
  entry: './_dev/js/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/src/js'),
    publicPath: 'public/src/js',
  },
  devServer: {
    port: 5200,
  },
  mode: 'production'
};
