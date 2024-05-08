import * as winston from 'winston';
const { combine, label, timestamp, printf } = winston.format;

class Logger {
  private readonly LOG_FILE = {
    ERROR: 'logs/error.log',
    WARN: 'logs/warn.log',
    VERBOSE: 'logs/verbose.log',
    DEBUG: 'logs/debug.log',
    INFO: 'logs/info.log',
    ALL: 'logs/all.log',
  };

  private logger: winston.Logger = null;

  constructor() {
    const logFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}:  ${message}`;
    });

    this.logger = winston.createLogger({
      format: combine(
        label({ label: '---- MTN ASSESSMENT: REST API LOGS ----' }),
        timestamp(),
        logFormat,
      ),
      transports: [
        new winston.transports.File({
          filename: this.LOG_FILE.ERROR,
          level: 'error',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.WARN,
          level: 'warn',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.ALL,
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.DEBUG,
          level: 'debug',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.INFO,
          level: 'info',
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.VERBOSE,
          level: 'verbose',
        }),
      ],
    });
  }

  error(data: any) {
    this.logger.error(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.error(arg || data) };
  }
  log(data: any) {
    this.logger.log(
      'info',
      typeof data === 'object' ? JSON.stringify(data) : data,
    );
    return { console: (arg?: any) => console.log(arg || data) };
  }
  warn(data: any) {
    this.logger.warn(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.error(arg || data) };
  }
  debug(data: any) {
    this.logger.debug(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.debug(arg || data) };
  }
  info(data) {
    this.logger.debug(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.info(arg || data) };
  }
  verbose(data: any) {
    this.logger.verbose(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.log(arg || data) };
  }
}

export default new Logger();
