const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = {
  target: 'node',
  entry: './src/entry-server.js',
  devtool: '#source-map',
  output: {
    path: `${__dirname}/target`,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }]
  },
  plugins: [
    new VueSSRServerPlugin(),
  ],
};
