'use strict';
var fs = require('fs'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    path = require('path'),
    childProcess = require('child_process');

fs.readdir(__dirname, (err, files) => {
  if (err) throw err;
  files.forEach( f => {
    if (f.match(/\.scenario$/)) {
      let filePath = path.join('spec', 'lib', 'expressions', f);
      let command = `bin/web-test ${filePath} --baseUrl=file:///${__dirname}`;
      childProcess.execSync(command, {stdio: [0,1,2]});
    }
  });
});
