import * as path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import * as nodeExternals from 'webpack-node-externals';
import * as webpack from 'webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';


const output = path.resolve(__dirname, '../../dist/@muslib/server/bundle');
console.log('Bundle file will be placed in ', output);

const config: webpack.Configuration = {
  entry: ['./src/server.ts'],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  devtool: 'inline-source-map',
  mode: 'production',
  optimization: {
    minimize: false
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
    new CopyWebpackPlugin([
      { from: '.env', to: '.env', toType: 'file'},
      { from: 'private', to: 'private' },
      { from: 'server.config.json', to: 'server.config.json', toType: 'file' }
    ])
  ],
  output: {
    path: output,
    filename: 'server.js'
  }
};

export default config;
