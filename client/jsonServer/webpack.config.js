const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './api/production-index.js',
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: 'final.js',
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
      node: true // in order to ignore built-in modules like path, fs, etc. 
  },
  target: 'node',
};