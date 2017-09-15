export default {
  name: 'index',

  webpack: {
    libraryTarget: 'umd',
  },

  build: {
    directory: 'dist',
  },

  babel: {
    plugins: ['transform-class-properties'],
    presets: [
      'flow',
      'stage-0',
      [
        'env',
        {
          modules: false,
        },
      ],
      'react',
    ],
  },
};
