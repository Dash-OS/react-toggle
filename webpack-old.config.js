import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

export default {
  entry: path.join(__dirname, 'src/docs/index.js'),
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'dist/docs'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
              presets: [
                'flow',
                [
                  'env',
                  {
                    useBuiltIns: true,
                    modules: false,
                    debug: false,
                    targets: {
                      web: true,
                    },
                  },
                ],
                'stage-0',
                'react',
              ],
              env: {
                production: {
                  presets: ['react-optimize'],
                  plugins: ['transform-class-properties'],
                },
              },
              plugins: [
                'transform-class-properties',
                'transform-react-jsx-source',
                // // This decorates our components with  __self prop to JSX elements,
                // // which React will use to generate some runtime warnings.åå
                'transform-react-jsx-self',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist/docs'),
    host: 'localhost',
    inline: true,
    info: false,
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src/docs/index.html') },
    ]),
  ],
};
