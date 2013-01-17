var redis = require('redis')
, bcrypt = require('bcrypt')
, db = redis.createClient();

module.exports = User;

function User(obj) {
    for (var key in obj) {
	this[key] = obj[key];
    }
}

User.prototype.save = function(fn) {
    if (this.id) {
	this.update(fn);
    } else {
	var self = this;
	db.incr('user:ids', function(err, id) {
	    if (err) return fn(err);
	    self.id = id;
	    self.hashPassword(function(err) {
		if (err) return fn(err);
		self.update(fn);
	    });
	});
    }
};


User.prototype.update = function(fn) {
    var multi = db.multi();
    multi.set('user:id:' + this.name, this.id, redis.print);
    multi.hmset('user:' + this.id, this, fn, redis.print);
    multi.exec(function(err, reps) {
	return console.log(reps);
    });
};

User.prototype.hashPassword = function(fn) {
    var self = this;
    bcrypt.genSalt(12, function(err, salt) {
	if (err) return fn(err);
	self.salt = salt;
	bcrypt.hash(self.pass, salt, function(err, hash) {
	    self.pass = hash;
	    fn();
	});
    });
};


// Accessor functions for user //
User.getByName = function(name, fn) {
    User.getId(name, function(err, id) {
	if (err) return fn(err);
	User.get(id, fn);
    });
};

User.getId = function(name, fn) {
    db.get('user:id:' + name, fn);
};

User.get = function(id, fn) {
    db.hgetall('user:' + id, function(err, user) {
	if (err) return fn(err);
	fn(null, new User(user));
    });
};

User.authenticate = function(name, pass, fn) {
    User.getByName(name, function(err, user) {
	if (err) return fn(err);
	if (!user.id) return fn();
	bcrypt.compare(pass, user.pass, function(err, res) {
	    if (err) return fn(err);
	    if (res) return fn(null, user);
	    fn();
	});
    });
};
