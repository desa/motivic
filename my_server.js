var flatiron = require('flatiron')
, cookieParser = require('connect').cookieParser
, session = require('connect').session
, static = require('connect').static
, path = require('path')
, app = flatiron.app
, director = require('director')
, qs = require('querystring')
, fs = require('fs')
, home = require(__dirname + '/lib/presenters/home.js')
, userHome = require(__dirname + '/lib/presenters/userHome.js')
, register = require(__dirname + '/lib/presenters/register.js')
, cli = require('flatiron-cli-config')
, u = require(__dirname + '/cmds/update.js');

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });


app.use(flatiron.plugins.cli, {
  usage: [
    '`app update`: Update static files with Roots project files.',
    '`app start_server`: Start the http server.'
     ],
  dir: path.join(__dirname, 'cmds')
});


app.start();