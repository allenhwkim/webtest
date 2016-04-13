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

  getLogMethod(logLevel) {
    switch(logLevel) {
      case this.LOG_LEVEL.DEBUG: return 'debug';
      case this.LOG_LEVEL.LOG:   return 'log';
      case this.LOG_LEVEL.INFO:  return 'info';
      case this.LOG_LEVEL.WARN:  return 'warn';
      case this.LOG_LEVEL.ERROR: return 'error';
    }
  }

  doLog(logLevel) {
    let toLog = this.sysLogLevel ^ logLevel;
    
    if (toLog) {
      let method = this.getLogMethod(logLevel);
      let args = [method.toUpperCase() + ':'];
      for (var i=0; i<arguments[1].length; i++) {
        args.push(arguments[1][i]);
      }
      console[method].apply(console, args);
    }
  }

  debug() { this.doLog(this.LOG_LEVEL.DEBUG, arguments); }
  log()   { this.doLog(this.LOG_LEVEL.LOG,   arguments); }
  info()  { this.doLog(this.LOG_LEVEL.INFO,  arguments); }
  warn()  { this.doLog(this.LOG_LEVEL.WARN,  arguments); }
  error() { this.doLog(this.LOG_LEVEL.ERROR, arguments); }

}

module.exports = Logger;
