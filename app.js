var flatiron = require('flatiron')
, path = require('path')
, app = flatiron.app
, director = require('director');
    

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

app.router.get('/a', function () {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end('Hello World!\n');
});

app.router

app.start(3000);
