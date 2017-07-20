const _ = require('lodash');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const config = require('./config.js');
const pkg = require('../package.json');

module.exports = _.merge({}, config, {
  output: {
    path: path.resolve(__dirname, '../build/dev'),
  },

  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin([
      { from: './src' }
    ], {
      ignore: ['js/**/*', 'manifest.json'],
      copyUnmodified: false
    }),
    new GenerateJsonPlugin(
      'manifest.json',
      require('../src/manifest.json'),
      ( key, value ) => {
        if( key ) {
          return value;
        }

        value.name = pkg.name;
        value.version = pkg.version;
        value.description = pkg.description;

        return value;
      }
    ),
  ],
  watch: true
});
