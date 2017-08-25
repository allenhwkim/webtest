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
    'l' :{
      alias: 'leave-browser-open',
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
      if (!argv['leave-browser-open']) {
        webTestCommand.get('close browser').func();
      }
      console.log(err);
    });
} else if (argv.browser) {
  //start web server
  var app = express();
  app.use(serveStatic(path.join(__dirname, 'src', 'web')));
  app.get('/run', (req, res, next) => {
    let command = req.query.cmd;
    webTestCommand.runCommand(command)
      .then(result => {
        console.log(result);
        result.response = result.response.toString();
        res.send(result);
      }).catch( err => {
        console.error('ERROR', err);
        res.send({result: 'ERROR', response: err});
      });
  });
  app.listen(argv.port || 3000);
  console.log('webserver running ...');
  //open browser with index.html
  webTestCommand.runCommand('open browser')
    .then(() => webTestCommand.runCommand('go to http://localhost:3000/'))
    .then(() => webTestCommand.runCommand('switch to frame browser-section')) //all command will run on iframe
    .then(() => webTestCommand.runCommand('go to http://localhost:8080/test/test-page.html')) //all command will run on iframe
} else {
  console.log("list of commands:");
  console.log(allHelps.map(el => `. ${el}`).join("\n"));
  webTestCommand.processNextCommand();
}
