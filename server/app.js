"use strict"

let express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    gapi = require('./lib/gapi'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan')
    bodyParser = require('body-parser'),
    Enum = require('enum');;

app.set('port', process.env.PORT || 8080);
app.use(express.static("."));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../templates')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan


app.set('views', path.join(__dirname, '../templates')); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages

// serve static files
app.use(express.static('dist'));

// GOOGLE OAUTH
const fs = require('fs');
const url = require('url');
const opn = require('opn');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

// start page. Shows google log-in button
app.get('/', function (req, res) {
	res.render('index.html');	
})

/************ Gmail auth ***************/

// start page. Shows google log-in button
app.get('/oauth2callback', function (req, res) {
	gapi.client.authenticate(req)
		.then(c => { // promise is not working
			console.log(c)
			gapi.getProfile().then(d => {
				// save to database. change content in index html
				// save token in file
				console.log(d)

			})
		})
		.catch(function(e) {
			console.log(e)
		})
	res.render('index.html');	
})

// redirect to google log-in (TODO: set this up)
app.post('/goauth2', function (req, res) {
  // grab the url that will be used for authorization
  gapi.client.authorizeUrl = gapi.client.oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: gapi.scopes.get.join(' ')
  });

  // open the browser to the authorize url to start the workflow
  opn(gapi.client.authorizeUrl, {wait: false}).then(cp => cp.unref());
});


/************* GOrganizer API *************/

/************* USER ************/

/**
 * Get the profile page for the :userId user
 **/
app.get('/:userId/profile', function(req, res) {
	// call the database for current user
	//res.render('profile.html')
})

/******** USER.FAVORITES ************/

app.get('/:userId/favorites', function(req, res) {

})

// create
app.post('/:userId/favorites')

// delete
app.post('/:userId/favorites/:id')


/*************** USER.NOTIFICATIONS ***************/

const NOTIFICATION_TYPE = new Enum([ "UNREAD_EMAIL", "RECEIVED_MESSAGE"]);

app.post('/:userId/notifications')

app.post('/:userId/notifications/:type')

app.post('/:userId/notifications/:id')

app.post('/:userId/notifications/')

app.post('/:userId/notifications/stop')

app.post('/:userId/notifications/start')

/*************** USER.REMINDERS ****************/

const REMINDER_TYPE = new Enum(["SEND_DRAFT", "SEND_REPLY", "EMAIL_DURATION"]);


// start server
app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});










