import webpack from 'webpack';

import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': process.env.NODE_ENV || 'production',
  }),
  ...(process.env.NODE_ENV === 'production'
    ? [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
        new UglifyJSPlugin({
          parallel: true,
          sourceMap: true,
        }),
      ]
    : []),
];
