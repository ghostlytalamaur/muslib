import path = require('path');
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import nodeExternals = require('webpack-node-externals');
import webpack = require('webpack');
import CopyPlugin = require('copy-webpack-plugin');


const output = path.resolve(__dirname, '../../dist/@muslib/server/bundle');
console.log('Bundle file will be placed in ', output);

const config: webpack.Configuration = {
  entry: ['./src/server.ts'],
  target: 'node',
  devtool: 'inline-source-map',
  mode: 'production',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        logLevel: 'WARN',
        logInfoToStdOut: true,
        extensions: ['.ts']
      })
    ]
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  externals: [
    nodeExternals({modulesDir: path.resolve(__dirname, '../../node_modules')}),
    nodeExternals()
  ],
  plugins: [
    new CopyPlugin([
      { from: '.env', to: '.env', toType: 'file'},
      { from: 'private', to: 'private' }
    ])
  ],
  output: {
    path: output,
    filename: 'server.js',
    publicPath: '/'
  }
};

export default config;
