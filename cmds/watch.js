var fs = require('fs')
, path = require('path')
, Start = require(__dirname + '/start.js')
, readdirp = require('readdirp')
, App = require(path.dirname(__dirname) + '/app.js')
, http_app = App.http_app;




var watch = module.exports = function() {
  readdirp({ root: path.dirname(__dirname), directoryFilter: [ '!.git', '!*modules' ] })
    .on('data', function (entry) {
      fs.watch(entry.fullPath, function (event, filename) {
        if (event === 'change') {
          console.log('refreshing......');
	   http_app.server.close();
          console.log('........................................');
          Start();
        };
      });
    });
    
    Start();
  
}

