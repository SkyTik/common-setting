const winston = require('winston');
require('winston-daily-rotate-file');

const format = winston.format;
const customAccessLevels = {
  levels: {
    http: -1,
    error: 0,
    warn: 1,
    info: 2,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta'
  }
};
winston.level = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
winston.addColors(customAccessLevels.colors);
winston.loggers.add('logger', {
  // levels: customAccessLevels.levels,
  format: format.combine(
    // format.label({ label: path.basename(process.mainModule.filename) }),
    // format.colorize({ all: true }), // Bug https://github.com/winstonjs/winston/issues/1416
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message ? info.message : JSON.stringify(info)}`
    )
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.DailyRotateFile({
      filename: `logs/errors-%DATE%.log`,
      level: 'error',
      handleExceptions: true,
      datePattern: 'YYYY-MM-DD'
    }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
  exitOnError: false
});

winston.loggers.add('httpLogger', {
  levels: customAccessLevels.levels,
  format: format.combine(
    // format.label({ label: path.basename(process.mainModule.filename) }),
    // format.colorize({ all: true }), // Bug https://github.com/winstonjs/winston/issues/1416
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `logs/access-%DATE%.log`,
      level: 'http', // Log only if info.level less than or equal to this level
      handleExceptions: false,
      datePattern: 'YYYY-MM-DD'
    })
  ],
  exitOnError: false
});
winston.loggers.add('firebaseLogger', {
  levels: customAccessLevels.levels,
  format: format.combine(
    // format.label({ label: path.basename(process.mainModule.filename) }),
    // format.colorize({ all: true }), // Bug https://github.com/winstonjs/winston/issues/1416
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `logs/firebase-%DATE%.log`,
      level: 'http', // Log only if info.level less than or equal to this level
      handleExceptions: false,
      datePattern: 'YYYY-MM-DD'
    })
  ],
  exitOnError: false
});

module.exports.logger = winston.loggers.get('logger');
module.exports.firebaseLogger = winston.loggers.get('firebaseLogger');
module.exports.httpLogger = winston.loggers.get('httpLogger');
