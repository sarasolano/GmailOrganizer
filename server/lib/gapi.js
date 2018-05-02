const path = require('path'),
  fs = require('fs');

const keyPath = path.join(__dirname, 'scopes.json');
let scopes = { scopes: [''] };
if (fs.existsSync(keyPath)) {
  scopes = require(keyPath).scopes;
}

const {google} = require('googleapis'),
    gclient = require('./gclient'),
    OAuth2Client = google.auth.OAuth2,
    gmail = google.gmail({
      version: 'v1', 
      auth: gclient.oAuth2Client
    }),
    oauth2 = google.oauth2('v2');

exports.ping = function() {
    console.log('pong');
};

exports.gmail = gmail;
exports.oauth = oauth2;
exports.client = gclient;
exports.scopes = scopes

var getProfile = async function() {
  console.log('gapi.getProfile')
  const res = await gmail.users.getProfile({userId: 'me', auth: gclient.oAuth2Client});
  return res.data;
}

exports.getProfile = getProfile;

var listEmails = async function() {
  const res = await gmail.users.messages.list({ userId: 'me', auth: gclient.oAuth2Client});
  console.log(res.data);
  return res.data;
}