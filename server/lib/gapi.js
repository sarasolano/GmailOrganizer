const SCOPES = ['https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'];

const {google} = require('googleapis'),
    OAuth2Client = google.auth.OAuth2,
    client = '558954110565-b7s34h1u4f269j4g7vshpa7hmbn6keb8.apps.googleusercontent.com',
    secret = 'hePvKfRqScoXbzFQvcT1oa0b',
    redirect = 'http://localhost:8080/oauth2callback',
    oauth2Client = new OAuth2Client(client, secret, redirect),
    gmail_auth_url = oauth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES
	  }),
    gmail = google.gmail('v1'),
    oauth2 = google.oauth2('v2');

exports.ping = function() {
    console.log('pong');
};

module.exports.url = gmail_auth_url;
module.exports.gmail = gmail;
module.exports.oauth = oauth2;
module.exports.client = oauth2Client;