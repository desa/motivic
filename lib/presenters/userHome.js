
exports.form = function(req, res) {

};

exports.index = function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('User Home');
  
}