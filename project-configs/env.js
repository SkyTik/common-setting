const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const PRODUCTION = process.env.NODE_ENV === 'production';
const rootDir = fs.realpathSync(process.cwd());
process.env.ROOT_DIR = rootDir;
let extendEnvPath = '';
if (PRODUCTION) {
  // for example
  if (fs.existsSync(path.resolve(rootDir, '.env.production'))) {
    extendEnvPath = path.resolve(rootDir, '.env.production');
  }
} else {
  extendEnvPath = path.resolve(rootDir, '.env.local');
}
if (extendEnvPath) {
  dotenvExpand(dotenv.config({ path: extendEnvPath }));
  dotenvExpand(dotenv.config());
}
