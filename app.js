var flatiron = require('flatiron')
, cookieParser = require('connect').cookieParser
, session = require('connect').session
, static = require('connect').static
, path = require('path')
, f_app = flatiron.app
, director = require('director')
, qs = require('querystring')
, fs = require('fs')
, home = require(__dirname + '/lib/presenters/home.js')
, userHome = require(__dirname + '/lib/presenters/userHome.js')
, register = require(__dirname + '/lib/presenters/register.js')
, cli = require('flatiron-cli-config')
, u = require(__dirname + '/cmds/update.js');
    

f_app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

f_app.use(flatiron.plugins.http, {
  before: [ 
    cookieParser('motivic app'),
    session({cookie: {maxAge: null}}),
    static(__dirname + '/static')
    ]
});

function signedIn(no, yes) {
  return function(args) {
    if (typeof this.req.session.user === 'undefined')
      no(this.req, this.res, args);
    else
      yes(this.req, this.res, args);
  };
};

function redirect(loc) {
  return function(req, res) {
    res.writeHead(302, {'location': loc});
    res.end();
  };
};

var routes = {
  '/': {
      get: signedIn(home.index, function(req, res, args) {
        (redirect('/' + req.session.user))(req, res);
      }),
      post: function() {
        home.form(this.req, this.res);
      }
    },
  '/home': {
      get: signedIn(redirect('/'), home.index),
      post: function() {
        home.form(this.req, this.res);
      }
    },
  '/logout': {
      get: function() {home.signOut(this.req, this.res);}
  },
  '/register': {
      get: signedIn(register.index, redirect('/')),
      post: register.form(this.res, this.req)
    },
  '/(\\w+)': {
          get: signedIn(redirect('/'), userHome.index),
          post: userHome.form(this.res, this.req)
    }
};


exports.app = function(t) {
  if (t) {
    f_app.http.before.push(function(req, res) {
      req.session.user = 'Erica';
      res.emit('next');
    });
    
    f_app.router = new director.http.Router(routes);

    f_app.name = 'Motivic App: Signed In';
    f_app.start(8000);

    f_app.log.info('Server running..., Erica logged in.');
    
  } else {
     f_app.router = new director.http.Router(routes);

     f_app.name = 'Motivic App';
     f_app.start(8000);
     f_app.log.info('Server running...');
      
    };
};
