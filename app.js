var express = require('express');
var routes = require('./routes');
var path = require('path');

var app = express();

app.set('port', process.env.VCAP_APP_PORT || 8081);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser() );
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'my secret', cookie: { maxAge : null } }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);
app.get('/partial/:name', routes.partial);

// MongoDB API Routes
app.get ('/api/caso', routes.listacasos);
app.get ('/api/caso/:id', routes.caso);
app.post('/api/caso', routes.nuevocaso);
app.post('/api/caso/:id', routes.savecaso);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
