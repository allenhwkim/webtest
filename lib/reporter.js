'use strict';

class Reporter {

  log() {
    console.log.apply(console, arguments);
  }
}

module.exports = Reporter;
