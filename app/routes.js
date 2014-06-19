// load up the user model
var Message         = require('../app/models/user').Message;
var User  			= require('../app/models/user').User;
var Objects         = require('../app/models/object');
var mongoose 		= require('mongoose');

/// Include ImageMagick
var im              = require('imagemagick');

var fs              = require("fs");

// app/routes.js
module.exports = function(app, passport) {

	var messagesTable = 'messages';

	app.post('/profile/messages', function(req, res) {
		
        var description 		= req.body.description;
		var newMessage 			= new Message({
			description: req.body.description,
			_creator: req.user._id
		});
        newMessage.save(function(err) {
            if (err)
                throw err;
            else {
            	req.user.local.messages.push(newMessage);
     			req.user.save();
            	res.send(newMessage);
            	res.redirect('/profile');
        	}
        });
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		console.log('get /PROFILE');
        res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
			log : '1'
		});
    });

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile/messages', isLoggedIn, function(req, res) {
		Message.find({_creator: req.user._id}, function(error, results) {
			if (error)
                throw error;
            res.send(results);
        });
	});

	app.get('/home', function(req, res) {
    	var userBlogs = function(callback) {
	    	Objects.find().exec(function(error, results) {
				if (error)
	                throw error;
	            var dateFin 	= new Array;
	            var dateDebut 	= new Array;
	            var name 		= new Array;
	            var longitude 	= new Array;
	            var latitude 	= new Array;
	            var description = new Array;
	            var type 		= new Array;
	            var prix 		= new Array;
	            var adresse 	= new Array;

	            for (var i = 0; i < results.length; i++) {
	            	dateFin[i] 		= results[i].dateFin;
	            	dateDebut[i] 	= results[i].dateDebut;
	            	name[i] 		= results[i].name;
	            	longitude[i] 	= results[i].longitude;
	            	latitude[i] 	= results[i].latitude;
	            	description[i] 	= results[i].description;
	            	type[i] 		= results[i].type;
	            	prix[i] 		= results[i].prix;
	            	adresse[i] 		= results[i].adresse;
	            }
				if (!req.session.passport.user) {
					res.render('home.ejs', { 
						title: 'Digo', 
						user: null, 
						log: null,
						dateFin: dateFin,
		          		dateDebut: dateDebut,
		          		name: name,
		          		longitude: longitude,
		          		latitude: latitude,
		          		description: description,
		          		type: type,
		          		prix: prix,
		          		adresse: adresse
		          	});
				} else {
					res.render('home.ejs', { 
						title: 'Digo', 
						message: '', 
						errors: {}, 
						user: req.session.user, 
						log : '1',
						dateFin: dateFin,
		          		dateDebut: dateDebut,
		          		name: name,
		          		longitude: longitude,
		          		latitude: latitude,
		          		description: description,
		          		type: type,
		          		prix: prix,
					});
				}
	        });
	     };
	    userBlogs(function(error, results) {
		    if (error) { 
		       /* panic! there was an error fetching the list of blogs */
		       return;
		    }
		    res.redirect('/home');
		});
    });

	app.post('/home/objects', function(req, res) {
		var newObject 				= new Objects();

		newObject.name 				= req.body.name;
		newObject.type 				= req.body.type;
        newObject.description 		= req.body.description;
        newObject.prix 				= req.body.prix;
        newObject.adresse 			= req.body.adresse;
        newObject.longitude 		= req.body.longitude;
        newObject.latitude 			= req.body.latitude;
        newObject.dateDebut 		= req.body.dateDebut;
        newObject.dateFin 			= req.body.dateFin;
        newObject.typeTransac 		= req.body.typeTransac;
        newObject.image.content 	= imageName;

		// save the user
        newObject.save(function(err) {
            if (err)
                throw err;
            res.send(newObject);
            res.redirect('/home');
        });
	});

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		// load the index.ejs file
		if (!req.session.passport.user) {
			res.render('index.ejs', { title: 'Digo', message: '', errors: {}, user: null, log: null, message: req.flash('loginMessage') });
		} else {
			res.render('index.ejs', { title: 'Digo', message: '', errors: {}, user: req.session.user, log : '1', message: req.flash('loginMessage') });
		}
	});

	app.get('/about', function(req, res) {
		console.log('GET /ABOUT');
		// load the index.ejs file
		if (!req.session.passport.user) {
			res.render('about.ejs', { title: 'Digo', log: null, user: null });
		} else {
			res.render('about.ejs', { title: 'Digo', log : '1', user: req.session.user });
		}
	});

	app.get('/contact', function(req, res) {
		if (!req.session.passport.user)
			res.render('contact.ejs', { title: 'Digo', log: null, user: null });
		else {
			res.render('contact.ejs', { title: 'Digo', log : '1', user: req.session.user });
		}
	});

	app.get('/search', function(req, res) {
		if (!req.session.passport.user)
			res.render('search.ejs', { title: 'Digo', log: null, user: null });
		else {
			res.render('search.ejs', { title: 'Digo', log : '1', user: req.session.user });
		}
	});

	app.delete('/profile/messages/:id', function(req, res) {

		Message.remove({_id:req.params.id}, function(error, result) {
			if (error) {
				res.send(error, 404);
			} else {
				res.send('');
			}
		});
	});

	app.post('/profile/messages/:id', function(req, res) {
		var message = req.body;
		message._id = req.params.id;
		console.log('/POST');

		Message.update({_id: message._id}, 
			{description:message.description}, 
		function(error, result) {
			if (error) {
				res.send(error, 404);
			} else {
				res.send('');
			}
		});
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		console.log('GET /LOGIN');
		// render the page and pass in any flash data if it exists
		if (!req.session.passport.user)
			res.render('index.ejs', { title: 'Digo', log: null, user: null, message: req.flash('loginMessage') });
		else {
			res.render('index.ejs', { title: 'Digo', log : '1', user: req.session.user, message: req.flash('loginMessage') });
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		console.log('GET /SIGNUP');
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		req.assert('name', 'Name is required').notEmpty();           //Validate name
        req.assert('email', 'A valid email is required').isEmail();  //Validate email
        var errors = req.validationErrors();  
        if( !errors) {   //No errors were found.  Passed Validation!
            res.redirect('/profile');
        }
        else {   //Display errors to user
	        res.render('index', { 
	            title: 'Form Validation Example',
	            message: '',
	            errors: errors,
	            title: 'Digo',
                user: null, 
                log: null, 
        	});
    	}
	});

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {

		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
