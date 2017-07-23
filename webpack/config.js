const path = require('path');

module.exports = {
  entry: {
    content: './src/js/content',
    options: './src/js/options',
  },
  output: {
    filename: './js/[name].js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../src/js'),
      'node_modules'
    ],
    extensions: ['*','.js','.vue'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, '../src/js')
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
      }
    }]
  }
};
