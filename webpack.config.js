const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'app', 'lib'),
    filename: '[name].js',
  },
};
