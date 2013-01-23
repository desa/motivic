var flatiron = require('flatiron')
, cookieParser = require('connect').cookieParser
, session = require('connect').session
, stat = require('connect').static
, path = require('path')
, director = require('director')
, qs = require('querystring')
, fs = require('fs')
, u = require(__dirname + '/cmds/update.js')
, index = require(__dirname + '/lib/presenters/index.js')
, db = require(__dirname + '/lib/resources/db.js');

var http_app = exports.http_app = flatiron.app;


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
      get: signedIn(index.home.index, function(req, res, args) {
        (redirect('/' + req.session.user))(req, res);
      }),
      post: function() {
        index.home.form(this.req, this.res);
      }
    },
  '/home': {
      get: signedIn(redirect('/'), index.home.index),
      post: function() {
        index.home.form(this.req, this.res);
      }
    },
  '/logout': {
      get: function() {index.logout(this.req, this.res);}
  },
  '/register': {
      get: signedIn(index.register.index, redirect('/')),
      post: index.register.form(this.res, this.req)
    },
  '/help': {
      get: function() {index.help.index(this.req, this.res);},
      post: index.help.form(this.res, this.req)
    },
  '/(\\w+)': {
          get: signedIn(redirect('/'), index.userHome.index),
          post: index.userHome.form(this.res, this.req)
    }
};

    

http_app.use(flatiron.plugins.http, {
  before: [ 
    cookieParser('motivic app'),
    session({cookie: {maxAge: null}}),
    stat(__dirname + '/static')
    ]
});



exports.app = function(port, user) {
    var first = true;
    if (user) {
	http_app.http.before.push(function(req, res) {
	    if (first) {
		req.session.user = user;
		first = false;
	    };
	    res.emit('next');
	});
	http_app.router = new director.http.Router(routes);
	
	http_app.name = 'Motivic App: Signed In as' + user;

	http_app.start(port);

	http_app.server.on('close', function() {
	    db.end();
	});
	
	http_app.log.info('Server running...');
	http_app.log.info('     ' + user + ' is signed in.');
	
    } else {
	http_app.router = new director.http.Router(routes);
	
	http_app.name = 'Motivic App';


	http_app.start(port);

	http_app.server.on('close', function() {
	    db.end();
	});

	http_app.log.info('Server running...');
	
    };
};
