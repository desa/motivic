var fs = require('fs')
, shell = require('shelljs')
, path = require('path')
, readline = require('readline')
, App = require(path.dirname(__dirname) + '/app.js');

var start = module.exports = function start (logged_in, r) {

  if (logged_in === 't') {
      App.app(true);
    } else {
      App.app(false);
    };

  console.log('----------------------------------------');
  console.log('Type Help to get a list of commands\n');
  
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.prompt();
  rl.on('line', function(cmd) {
    if (cmd == 'help') {
      console.log('`exit`: stop the server');
      console.log('`refresh`: refresh the server');
    };
    if (cmd === 'exit') {
      console.log('Goodbye!');
      process.exit(0);
      rl.close();
    };
    if (cmd === 'refresh') { 
      rl.close();
      process.exit(0);
      start(process.argv[3]);
    };
    
    rl.prompt();
  });
};

