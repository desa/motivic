var db = require('./db.js');

module.exports = Block;

function Block(obj) {
    for (var key in obj) {
	this[key] = obj[key];
    }
}

Block.prototype.save = function(fn) {
    if (this.id) {
	    this.update(fn);
    } else {
	    var self = this;
	    db.incr('block:ids', function(err, id) {
	      if (err) return fn(err);
	      self.id = id;
	    });
	  }
};


Block.prototype.update = function(fn) {
    var multi = db.multi();
    multi.set('block:id:' + this.name, this.id,	function() {});
    multi.hmset('block:' + this.id, this, fn,  function() {});
    multi.exec(function(err, reps) {
	    return function() {};
    });
};

var main = new Block({id: '1',
		      name: 'Main', 
		      address: 'Erica.Main',
		      sync: null,
		      parents: null,
		      children: null,
		      author: 'Erica@motivic.com',
		      dateCreated: new Date(),
		      dateUpdated: new Date(),
		      content: {body: 'Main Block', onEdit: {}},
		      rules: {permissions: 
			      {read: [
				  [{only: 'Erica@motivic.com'},
			   {all: true}]
			      ],
			       write:  [
				   [{only: 'Erica@motivic.com'},
				    {all: true}]
			       ]},
			      conditions: []}
		     });

main.save(function() {});



// Accessor functions for Block //

Block.getByName = function(name, fn) {
    Block.getId(name, function(err, id) {
	    if (err) return fn(err);
	    Block.get(id, fn);
    });
};

Block.getId = function(name, fn) {
    db.get('Block:id:' + name, fn);
};

Block.get = function(id, fn) {
    db.hgetall('Block:' + id, function(err, block) {
	    if (err) return fn(err);
	    fn(null, new Block(block));
    });
};

Block.main = function(fn) {
    fn(null, main);
};
