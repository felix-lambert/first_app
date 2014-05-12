/**
 * Module dependencies.
 */
	http = require('http'), 
	express = require('express'),
	path = require('path');

//create express app
var app = express();

//config express in all environments
app.configure(function(){
  	app.set('views', __dirname + '/views');
  	app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'public')));
});

var routes = require('./routes/routes')(app);

app.listen(8080);