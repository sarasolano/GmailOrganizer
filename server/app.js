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
app.use(express.static(__dirname));
app.use(express.static('../js'));
app.use(express.static('../css'));
app.use(express.static('../templates'))
app.use(express.static("."));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(express.cookieParser());
// app.use(express.methodOverride());
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan


app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
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
	// add url to go to gmail
	res.render('index.html');	
})

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});


// redirect to google log-in (TODO: set this up)
app.post('/goauth2', function (req, res) {
	var code = req.query.code;
	console.log("this is the token code: " + code);

	gapi.client.getToken(code, function(err, tokens){
    gapi.client.credentials = tokens;
    getData();
  });

	res.render("index.html")
	// readClientSecret('client_secret.json')
	// 	.then(clientSecretJson => {
	// 		let clientSecret = JSON.parse(clientSecretJson);
 //    		return authorize(clientSecret);
	// 	})
});

var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
      console.log(results);
  });
  gapi.gmail.users.messages.list().withAuthClient(gapi.client).execute(function(err, results){
    console.log(results);
  });
};









