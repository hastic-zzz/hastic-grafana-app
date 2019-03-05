const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  target: 'node',
  context: resolve('src'),
  entry: {
    './module': './module.ts',
    './panel/graph_panel/module': './panel/graph_panel/graph_ctrl.ts',
    './datasource/module': './datasource/module.ts'
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    libraryTarget: 'amd'
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    'lodash', 'moment', 'angular',
    function(context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: 'plugin.json' },
      { from: 'img/*' },
      { from: 'panel/graph_panel/plugin.json', to: 'panel/graph_panel/plugin.json' },
      { from: 'panel/graph_panel/partials/*' },
      { from: 'datasource/plugin.json', to: 'datasource/plugin.json' },
    ])
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        loaders: [
          'ts-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /jquery\.flot\.(?!events)/,
        loaders: [
          'imports-loader?jQuery=jquery'
        ]
      },
      {
        test: /jquery\.flot\.events/,
        loaders: [
          'imports-loader?jQuery=jquery,lodash=lodash,angular=angular,tetherDrop=tether-drop'
        ]
      }
    ]
  }
}
