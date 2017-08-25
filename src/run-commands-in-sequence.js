'use strict';
var webTestCommand = require('./web-test-command');

function runCommandsInSequence(commandStrings) {
  let result = Promise.resolve();
  commandStrings.forEach(commandStr => {
    let commandObj = webTestCommand.getCommand(commandStr);
    let func, args, output;

    if (commandObj) {
      func = commandObj.func;
      args = commandObj.arguments;
      output = commandStr.replace(/^(\s+)/, '$1> ');
    } else {
      func = function() { return Promise.resolve()};
      args = [];
      output = '#' + commandStr;
    }
    result = result.then(() => {
      console.log(output);
      return func.apply(null, args)
    });
  });
  return result;
}

module.exports = runCommandsInSequence;
