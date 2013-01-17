var union = require('union')
, director = require('director')
, fs = require('fs')
, connect = require('connect')
, buffet = require('buffet');

var router = new director.http.Router();


var server = union.createServer({
    before: [
	function(req, res) {
	    var found = router.dispatch(req, res);
	    if (!found) {
		res.emit('next');
	    }
	}
    ]
});


router.path('/', function() {
    this.get(function() {
	var req = this.req
	  , res = this.res;

	fs.readFile('./static/home.html', 'utf8', function(err, data) {
	    if (err) {
		res.writeHead(404);
		res.end();
		return;
	    }

	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.end(data);
	});
    });

    //This may need to be redone
    this.post(function() {
	var user = {
	    name: this.req.body['user[name]'],
	    pass: this.req.body['user[pass]']
	};

	//This needs to be moved somewhere else
	// PUT AUTHENTICATE USER LOGIN HERE

	this.res.writeHead(200, {"Content-Type": "text/plain"});
	this.res.end("Username: " + user.name + " Password: " + user.pass); 
    });
});

router.path('/register', function() {
    //Needs correct html
    this.get(function() {
	fs.readFile('./static/index.html', 'utf8', function(err, data) {
	    if (err) {
		res.writeHead(404);
		res.end();
		return;
	    }
	    
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.end(data);
	});
    });

    //Needs implementation
    this.post(function() {
	
    });
});


server.listen(3000);
