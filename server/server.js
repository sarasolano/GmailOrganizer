"use strict"

const express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    gapi = require('./lib/gapi'),
    database = require('./data/database'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    opn = require('opn');

const PORT = 8080;

app.set('port', process.env.PORT || PORT);
app.use(express.static("."));
app.use(express.static(__dirname));
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../templates')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({ secret: 'GOrganizer', resave: false, saveUninitialized: true, }));
app.use(expressValidator());

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan

app.set('views', path.join(__dirname, '../templates')); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages

// serve static files
app.use(express.static('dist'));

// GOOGLE OAUTH
const fs = require('fs');
const url = require('url');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

app.get('/', function(req, res) {
  res.redirect('/login'); 
})

// start page. Shows google log-in button
app.get('/login', function (req, res) {
  database.initilize()
	res.render('login.html');	
})

app.get('/logout', function(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    } 
    res.render('login.html')
  })
  
})

/************ Gmail auth ***************/

// start page. Shows google log-in button
app.get('/oauth2callback', function (req, res) {
	gapi.client.authenticate(req)
		.then(c => { // promise is not working
      req.session.token = c.credentials

      res.redirect('/profile')

      console.log(req.session.token)
		})
		.catch(function(e) {
			console.log(e)
		})
})

// redirect to google log-in (TODO: set this up)
app.get('/goauth2', function (req, res) {
  // check if token exits and is not expired
  if (req.session.token) {

  }

  //grab the url that will be used for authorization
  gapi.client.authorizeUrl = gapi.client.oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: gapi.scopes.get
  });

  //open the browser to the authorize url to start the workflow
  opn(gapi.client.authorizeUrl);
});


/************* GOrganizer API *************/

// ************ USER ***********

/**
 * Get the profile page for the :userId user
 **/
app.get('/profile', function(req, res) {
	// call the database for current user
  if (!req.session.token) {
    res.redirect('/goauth2');
    return;
  }
  database.initilize()
  gapi.client.credentials = req.session.token;
	gapi.getProfile().then(d => {
		console.log(d)
    res.render('profile.html', {'userId' : d.emailAddress})
	}).catch(e => console.log(e))
})

/***************** EMAILS ***********************/
app.post('/:userId/getEmails', function(req, res) {
  if (!req.session.token) {
    res.redirect('/goauth2');
    return;
  }

  gapi.client.credentials = req.session.token;
  gapi.getMessageList(req.page, '').then(d => {
    console.log(d.resultSizeEstimate)
    res.send(d);
  })
})

app.post('/:userId/getEmailsFromFavorite', function(req, res) {
  if (!req.session.token) {
    res.redirect('/goauth2')
    return
  }

  gapi.client.credentials = req.session.token;
  gapi.getEmailsFromFavorite(req.email).then(d => {
    console.log(d.resultSizeEstimate)
    res.send(d);
  })
})


/******** USER.REMINDERS ************/

app.post('/:userId/addReminder', function(req, res) {
  database.addReminder(req.params.userId, req.body.text, (data) => {res.send(data)})
})

app.post('/:userId/getReminders', function(req, res) {
  database.getReminders(req.params.userId, (data) => {res.send(data)})
  
})

app.post('/:userId/deleteReminder', function(req, res) {
  database.deleteReminder(req.params.userId, req.body.text, (data) => {res.send(data)})
})

/******** USER.FAVORITES ************/
app.post('/:userId/getFavorites', function(req, res) {
  database.getFavorites(req.params.userId, (data) => {res.send(data)})
})

// create
app.post('/:userId/addFavorite', function(req, res) {
  database.addFavorite(req.params.userId, 
    req.body.email, req.body.firstName, req.body.lastName, (data) => {res.send(data)})
})  

// delete
app.post('/:userId/deleteFavorite', function(req,res) {
 database.deleteFavorite(req.params.userId, req.body.email, (data) => {res.send(data)})
})


/*************** USER.NOTIFICATIONS ***************/

// const NOTIFICATION_TYPE = new Enum([ "UNREAD_EMAIL", "RECEIVED_MESSAGE"]);

app.post('/:userId/notifications')

app.post('/:userId/notifications/:type')

app.post('/:userId/notifications/:id')

app.post('/:userId/notifications/')

app.post('/:userId/notifications/stop')

app.post('/:userId/notifications/start')


// Notification sockets
const notificationSecret = process.env.NOTIFICATION_SECRET || 'NOTIFICATION_SECRET';
const notificationKey = process.env.NOTIFICATION_KEY || 'NOTIFICATION_KEY'
const NOTIFICATION_EVENTS = {
    newNotification: 'NEW_NOTIFICATION',
    addFavorite: 'ADD_FAVORITE',
    addedAsFavorite: 'ADDED_AS_FAVORITE',
    unreadEmail: 'UNREAD_EMAIL',
    receivedMessage: 'RECEIVED_MESSAGE'
};

// const server = http.createServer(app.app);

// const io = require('socket.io')(server)
 
// io.on('connection', (socket) => {
//   console.log('a user connected')

//   if (!validateConnection(socket.handshake.query)){
//     return;
//   }

//   socket.on('join', (channel) => {
//       socket.join(channel)
//   });

//   socket.on('notificaion', function(msg){
//     socket.broadcast(msg)
//   });

//   socket.on('leave', (channel) => {
//     socket.leave(channel);
//   })

// }); 

function validateConnection(query) {
  if (query.notificationKey !== notificationKey) {
    return;
  }

  return true;
}

/*************** USER.REMINDERS ****************/

// const REMINDER_TYPE = new Enum(["SEND_DRAFT", "SEND_REPLY", "EMAIL_DURATION"]);


// start server
app.listen(PORT, function(){
    console.log('- Server listening on port ', PORT);
});










