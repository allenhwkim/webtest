#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');

// arguments
var argv = require('yargs')
  .usage('Usage: $0 <command-files> [options]')
  .options({
    's': {
      alias: 'speed',
      describe: 'execution speed in milliseconds',
      type: 'number'
    },
    'o' :{
      alias: 'open-browser',
      describe: 'if true, do not close browser with errors',
      type: 'boolean'
    }
  })
  .example('$0 command1.txt command 2.txt --speed=1000 --open-browser=true', 
    'run command1.txt and command2.txt with speed 1 second')
  .help('h')
  .argv;

var webTestCommand = require(path.join(__dirname, 'src', 'web-test-command'));
var runCommandsInSequence = require(path.join(__dirname, 'src','run-commands-in-sequence'));

var allCommands = webTestCommand.getAllCommands();
var allHelps = allCommands.map(cmd => cmd.help);
allCommands.forEach(commandObj => webTestCommand.register(commandObj));

/**
 * if file is given, do batch process
 * if none given, open command line interface
 */
var testFiles = argv._;
if (testFiles.length) {
  let lineCommands = [];
  testFiles.forEach(testFile => {
    if (fs.existsSync(testFile)) {
      lineCommands.push('FILE:' + testFile);
      lineCommands = lineCommands.concat(fs.readFileSync(testFile, "utf8").split('\n'))
    } else {
      throw `Invalid file name ${testFile}`;
    }
  });
  runCommandsInSequence(lineCommands)
    .then(() => console.log('DONE'))
    .catch(err => {
      if (!argv['open-browser']) {
        webTestCommand.get('close browser').func();
      }
      console.log(err);
    });
} else {
  console.log("list of commands:");
  console.log(allHelps.map(el => `. ${el}`).join("\n"));
  webTestCommand.processNextCommand();
}