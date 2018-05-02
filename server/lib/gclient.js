'use strict';

/**
 * This is used by several samples to easily provide an oauth2 workflow.
 * Credit: GOOGLE API SampleClient
 */

const {google} = require('googleapis');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');

const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-gorganizer.json';

const keyPath = path.join(__dirname, 'client_secret.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

class GClient {
  constructor (options) {
    this._options = options || { scopes: [] };

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris[0]
    );
  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
  authenticate (req) {
    return new Promise((resolve, reject) => {
      try {
        if (req.url.indexOf('/oauth2callback') > -1) {
          const qs = querystring.parse(url.parse(req.url).query);
          console.log('Authentication successful!');

          var client = this.oAuth2Client
          // fs.readFile(TOKEN_PATH, function(err, token) {
          //   if (err) {
              client.getToken(qs.code, function(err, token) {
                if (err) {
                  console.log('Error while trying to retrieve access token', err);
                  return;
                }

                client.credentials = token
                try {
                  fs.mkdirSync(TOKEN_DIR)
                } catch (err) {
                  if (err.code != 'EEXIST') {
                    throw err;
                  }
                }
                fs.writeFile(TOKEN_PATH, JSON.stringify(token));
                console.log('Token stored to ' + TOKEN_PATH);
              });
            // } else {
            //   client.credentials = JSON.parse(token);
            // }
            resolve(client);
          // });
          
          this.oAuth2Client = client
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new GClient();