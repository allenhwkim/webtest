#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');

var argv = require('yargs')
  .usage('Usage: $0 <command-files> [options]')
  .options({
    's': { alias: 'speed', describe: 'execution speed in milliseconds', type: 'number' },
    'l' :{ alias: 'leave-browser-open', describe: 'if true, do not close browser with errors', type: 'boolean' },
    'i' :{ alias: 'cli', describe: 'if true, run in interactive mode', type: 'boolean' },
    'b' :{ alias: 'browser', describe: 'if true, run in interactive mode in a browser', type: 'boolean' }
  })
  .example('$0 command1.txt command 2.txt --speed=1000 --open-browser=true', 
    'run command1.txt and command2.txt with speed 1 second')
  .example('$0 file1.txt command file2.txt --s 1000 -l', 'run file1.txt and file2.txt with speed 1 second')
  .example('$0', 'open interactve mode')
  .example('$0 -b', 'open browser mode')
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
      if (!argv['leave-browser-open']) {
        webTestCommand.get('close browser').func();
      }
      console.log(err);
    });
} else if (argv.browser) {
  //start web server
  var app = express();
  var port = argv.port || 3000;
  app.use(serveStatic(path.join(__dirname, 'src', 'web')));
  app.get('/run', (req, res, next) => {
    let command = req.query.cmd.trim(), cmdObj, resp;
    console.log('running', command);
    cmdObj = webTestCommand.getCommand(command);
    webTestCommand.runCommand(command)
      .then(result => {
        let resp = typeof result === 'string' ? result : 'ok';
        res.send(resp);
      }).catch( err => {
      	console.log(err);
        res.status(500);
        res.send(''+err);
      });
  });
  app.listen(port);
  console.log('webserver running ...');

  //open browser with index.html
  webTestCommand.runCommand('open browser')
    .then(() => webTestCommand.runCommand('go to http://localhost:'+port))
    .then(() => webTestCommand.runCommand('switch to frame browser-section')) //all command will run on iframe
    .then(() => webTestCommand.runCommand('go to https://rawgit.com/allenhwkim/touch-ui/master/demo/index.html'));

} else {
  console.log("list of commands:");
  console.log(allHelps.map(el => `. ${el}`).join("\n"));
  webTestCommand.processNextCommand();
}
