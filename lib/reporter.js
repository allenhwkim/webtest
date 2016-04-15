'use strict';

class Reporter {

  log() {
    arguments[0] = 
      arguments[0] == Reporter.CASE ? '  ' :
      arguments[0] == Reporter.STEP ? '    ' : '';
    
    console.log.apply(console, arguments);
  }
}

Reporter.SCENARIO = 1;
Reporter.CASE = 2;
Reporter.STEP = 3;

module.exports = Reporter;
