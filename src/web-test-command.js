'use strict';

let singletonInstance = null;

/**
 * set and get user-defined webtest command objects
 * e.g. `open browser http://www.google.com`
 */
class WebTestCommand {
  constructor(config) {
    !singletonInstance && (singletonInstance = this);
    this.commandObjects = {};
    return singletonInstance;
  }

  register(commandObj) {
    if ( typeof commandObj.name !== 'string'
      || !(commandObj.regExp instanceof RegExp)
      || !(typeof commandObj.func === 'function')
    ) {
      throw `ERROR: command object requires name, regExp, and func`;
    }

    if (this.commandObjects[commandObj.name]) {
      throw `ERROR: duplicate command registration. command ${commandObj.name} already exists`;
    } else {
      this.commandObjects[commandObj.name] = commandObj;
    }
  }

  /**
   * get command object from an user command. e.g. 'click .foo.bar'
   */
  get(commandStr) {
    let commandObjWithArguments;
    let trimmedCommandStr = commandStr.trim();

    for (var key in this.commandObjects) {
      let commandObj = this.commandObjects[key];
      if (trimmedCommandStr.match(commandObj.regExp)) {
        commandObjWithArguments = commandObj;
        break;
      }
    }

    if (commandObjWithArguments) {
      let matches = trimmedCommandStr.match(commandObjWithArguments.regExp);
      commandObjWithArguments.arguments = [matches[1], matches[2], matches[3]].filter(Boolean);
    }
    return commandObjWithArguments;
  }

}

module.exports = new WebTestCommand();