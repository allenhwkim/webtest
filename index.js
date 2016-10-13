#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var webTestCommand = require(
  path.join(__dirname, 'src', 'web-test-command'));
var runCommandsInSequence = require(
  path.join(__dirname, 'src', 'run-commands-in-sequence'));
var InquirerCommandPrompt = require(
  path.join(__dirname, 'src', 'inquirer-command-prompt'));
inquirer.registerPrompt('command', InquirerCommandPrompt);

/**
 * arguments 
 */
var argv = require('yargs')
  .usage('Usage: $0 <command-file> [options]')
  .example('"$0 my-commands.txt"', 'run file then quit')
  .help('h')
  .argv;
var commandsFile = argv._[0];

/**
 * register commands and helps
 */
var commandFiles = fs.readdirSync(path.join(__dirname, 'commands'));
var helps = [];
commandFiles.forEach( file => {
  let commandObj = require(path.join(__dirname, 'commands', file));
  webTestCommand.register(commandObj);
  commandObj.help && helps.push(commandObj.help);
});

/**
 * if file is given, do batch process
 * if none given, open CLI
 */
if (commandsFile) {
  if (fs.existsSync(commandsFile)) {
    var commands = fs.readFileSync(commandsFile, "utf8");
    runAll(commands.split("\n"));
  } else {
    throw `Invalid file name ${commandsFile}`;
  }
} else {
  console.log("list of commands:");
  console.log(helps.map(el => `. ${el}`).join("\n"));
  processCommand();
}

function processCommand() {
  inquirer.prompt([{
    name: 'webtest-command',
    type: 'command',
    message: '>',
    validate: function(command) {
      return true;
    }
  }]).then(function(answers) {
    let cmd = answers['webtest-command'];
    if (!cmd || cmd === '?' || cmd === 'help') {
      return Promise.resolve('help');
    } else {
      let cmdObj = webTestCommand.get(cmd);
      return cmdObj ? Promise.resolve(cmdObj) : Promise.reject(cmdObj);
    }
  }).then(
    function(cmdObj) {
      if (cmdObj === 'help') {
        console.log("list of commands:");
        console.log(helps.map(el => `. ${el}`).join("\n"));
        return true;
      } else {
        let func = cmdObj.func;
        let args = cmdObj.arguments;
        return func.apply(null, args);
      }
    },
    function(err) {
      throw "Invalid webtest command";
    }
  ).then(function() {
    console.log('OK');
    processCommand();  //process the next command
  }).catch(err => {
    console.error('ERROR', err);
    processCommand();
  });
}

/**
 * returns promise after running the given command string
 */
function runAll(commandStrings) {
  if (!Array.isArray(commandStrings)) {
    throw "Invalid command. Must be an array of commands";
  }
  runCommandsInSequence(commandStrings)
    .then(() => console.log('DONE'))
    .catch(err => {
      webTestCommand.get('close browser').func();
      console.log(err);
    });
}

