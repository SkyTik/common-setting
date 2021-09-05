require('./env.js');

const config = module.exports;
const PRODUCTION = process.env.NODE_ENV === 'production';
config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '0.0.0.0'
};

if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0';
}
process.env.ip = config.express.ip;
process.env.port = config.express.port;
// config.db same deal
// config.email etc
// config.log
