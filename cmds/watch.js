var fs = require('fs')
, path = require('path')
, Start = require(__dirname + '/start.js')
, readdirp = require('readdirp')
, App = require(path.dirname(__dirname) + '/app.js');




var watch = module.exports = function(t) {
  var tr = (t === 't');
  readdirp({ root: path.dirname(__dirname), directoryFilter: [ '!.git', '!*modules' ] })
    .on('data', function (entry) {
      fs.watch(entry.fullPath, function (event, filename) {
        if (event === 'change') {
          console.log('refreshing......');
          console.log('...................');
          Start(t, true);
        };
      });
    });
    
    Start(t);
  
}