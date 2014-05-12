exports = module.exports = function(app) {
	app.get('/pages/about', require('./about').init);
  	app.get('/pages/contact', require('./contact').init);
  	app.get('/', require('./pages').init);
  	app.get('/pages/event', require('./event').init);
};
