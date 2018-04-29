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
    bodyParser = require('body-parser');

app.set('port', process.env.PORT || 8080);
app.use(express.static("."));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../templates')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(express.cookieParser());
// app.use(express.methodOverride());
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan


app.set('views', path.join(__dirname, '../templates')); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages

// serve static files
app.use(express.static('dist'));

// GOOGLE OAUTH
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
// const Base64 = require('js-base64').Base64;

// start page. Shows google log-in button
app.get('/', function (req, res) {
	res.render('index.html');	
})

// start page. Shows google log-in button
app.get('/oauth2callback', function (req, res) {
	res.render('index.html');	
})

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});

// redirect to google log-in (TODO: set this up)
app.post('/goauth2', function (req, res) {
	console.log('goauth2')
	gapi.client.authenticate(gapi.scopes.get)
		.then(c => { // promise is not working
			console.log(c)
			let data = getProfile()
			console.log(data)
		})
		.catch(console.error)

	res.render("index.html")
});

async function getProfile() {
	console.log('getProfile')

  const res = await gmail.users.getProfile({userId: 'me'})
  console.log('getProfile: ' + res.data)

  return res.data;
}









