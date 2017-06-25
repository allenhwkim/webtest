'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var webtestDriver = require('./web-test-driver');
let seleniumWebdriver = require('selenium-webdriver');
var until = seleniumWebdriver.until;
var By = seleniumWebdriver.By;

let singletonInstance = null;
/**
 * set and get user-defined webtest command objects
 * e.g. `open browser http://www.google.com`
 */
class WebTestCommand {

  constructor(config) {
    !singletonInstance && (singletonInstance = this);
    this.commandObjects = {};
    this.helps = [];

    // register a new inquirer prompt type, command
    let InquirerCommandPrompt = require(path.join(__dirname, 'inquirer-command-prompt'));
    inquirer.registerPrompt('command', InquirerCommandPrompt);

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
      this.helps.push(commandObj.help);
    }
  }

  /**
   * get command object from an user command. e.g. 'click .foo.bar'
   */
  getCommand(commandStr) {
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

  getAllCommands() {
    let commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands'));
    return commandFiles.map(
      fileName => require(path.join(__dirname, '..', 'commands', fileName))
    );
  }

  runCommand(command) {
    return Promise.resolve(command)
      .then(command => {
        return this.getCommand(command);
      }).then( cmdObj => {
        let ret;
        if (cmdObj && cmdObj.func) {                          // command given and command found
          let func = cmdObj.func;
          let args = cmdObj.arguments;
          func.apply(null, args);
          ret = cmdObj.regExp;
        } else if (command === '?' || command === 'help') {     // help asked
          ret = 'list of commands:\n' + this.helps.map(el => '. '+el).join('\n')
        } else if (command && typeof cmdObj === 'undefined') { // command given but command not found
          let matches = command.match(/^(\w+)/);
          if (matches) {
            let prop = command.match(/^(\w+)/)[0];
            if (webtestDriver[prop]) {
              ret = '' + eval(`webtestDriver.${cmd}`)
            }
          } 
        } else if (command === '') {                            // command is not given at all
          ret = command;
        }
        if (typeof ret === 'undefined') {
          throw "Invalid webtest command";
        }
        return ret;
      }).then( str => {
        return { result: 'OK', response: str };
      });
  }

  processNextCommand() {
    let cmd;
    inquirer.prompt([{
      name: 'webtest-command',
      type: 'command',
      message: '>',
      validate: command => true
    }]).then(answers => {
      cmd = answers['webtest-command'];
      return this.runCommand(cmd);
    }).then( resp => {
      console.log(resp.result, resp.response);
      this.processNextCommand(); 
    }).catch(err => {
      console.error('ERROR', err);
      this.processNextCommand();
    });
  }
}

module.exports = new WebTestCommand();
