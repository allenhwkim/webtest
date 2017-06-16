'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var webtestDriver = require('./selenium-web-test-driver');
let seleniumWebDriver = require('selenium-webdriver');
var until = seleniumWebDriver.until;
var By = seleniumWebDriver.By;

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

  getAllCommands() {
    let commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands'));
    return commandFiles.map(
      fileName => require(path.join(__dirname, '..', 'commands', fileName))
    );
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
      if (!cmd || cmd === '?' || cmd === 'help') {
        return Promise.resolve('help');
      } else {
        let cmdObj = this.get(cmd);
        return cmdObj ? Promise.resolve(cmdObj) : Promise.reject(cmdObj);
      }
    }).then(
      cmdObj =>  {
        if (cmdObj === 'help') {
          console.log("list of commands:");
          console.log(this.helps.map(el => `. ${el}`).join("\n"));
          return true;
        } else {
          let func = cmdObj.func;
          let args = cmdObj.arguments;
          console.log(cmdObj.regExp);
          return func.apply(null, args);
        }
      },
      err => {
        let prop = cmd.match(/^(\w+)/)[0];
        if (webtestDriver[prop]) {
          console.log(eval(`webtestDriver.${cmd}`));
        } else {
          throw "Invalid webtest command";
        }
      }
    ).then( () => {
      console.log('OK');
      this.processNextCommand(); 
    }).catch(err => {
      console.error('ERROR', err);
      this.processNextCommand();
    });
  }
}

module.exports = new WebTestCommand();
