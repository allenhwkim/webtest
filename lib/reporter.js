'use strict';

class Reporter {

  constructor() {
  }

  log() {
    console.log.apply(console, arguments);
  }
}

module.exports = Reporter;
