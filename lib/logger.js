'use strict';

class Logger {
  constructor(logLevel) {
    this.sysLogLevel = logLevel;
  }
  get LOG_LEVEL() {
    return {
      ALL:   parseInt('11111',2),
      DEBUG: parseInt('00001',2),
      LOG:   parseInt('00010',2),
      INFO:  parseInt('00100',2),
      WARN:  parseInt('01000',2),
      ERROR: parseInt('10000',2),
      NONE:  parseInt('00000',2)
    };
  }

  doLog(logLevl) {
    let toLog = this.sysLogLevel ^ logLevel;
    
    if (toLog) {
      let method = 'log';
      switch(logLevel) {
        case this.LOG_LEVEL.DEBUG: method = 'debug'; break;
        case this.LOG_LEVEL.INFO:  method = 'info';  break;
        case this.LOG_LEVEL.WARN:  method = 'warn';  break;
        case this.LOG_LEVEL.ERROR: method = 'error'; break;
      }
      console[logLevel].apply(console, arguments);
    }
  }

  debug() { doLog(this.LOG_LEVEL.DEBUG, arguments); }
  log()   { doLog(this.LOG_LEVEL.LOG,   arguments); }
  info()  { doLog(this.LOG_LEVEL.INFO,  arguments); }
  warn()  { doLog(this.LOG_LEVEL.WARN,  arguments); }
  error() { doLog(this.LOG_LEVEL.ERROR, arguments); }

}

module.exports = Logger;
