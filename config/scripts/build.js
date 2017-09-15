import webpack from 'webpack';
import path from 'path';
import handleRootDir from 'app-root-dir';
import { exec, log } from '../utils';
import webpackConfigurationFactory from '../webpack';

import params from '../../app';

/*
  Our Factory takes a config object and returns a webpack configuration
*/
log({
  title: 'Starting Build',
  message: 'Starting Webpack Compiltation',
});

const webpackConfig = webpackConfigurationFactory({});

const rootDir = handleRootDir.get();

const compiler = webpack(webpackConfig);

exec(`rimraf "${path.resolve(rootDir, params.build.directory)}"`);

// dfsdfd;
compiler.run((err, stats) => {
  if (err) {
    return log({
      title: 'Build Failed',
      message: err.message,
      level: 'error',
    });
  }
  log({
    title: 'Build Complete!',
    message: 'Webpack Build Completed!',
  });
  console.log(stats.toString({ colors: true }));
});
