/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request = require('request')
 var querystring = require('querystring')

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

module.exports = {

  /**
   * `LoginController.login()`
	 *
	 * Initiales the login request using Spotify credentials
   */
  login: function (req, res) {

		var state = generateRandomString(16);
		var scope = 'user-read-private user-read-email user-top-read';

		res.cookie(stateKey, state);

		res.redirect('https://accounts.spotify.com/authorize?' +
	    querystring.stringify({
	      response_type: 'code',
	      client_id: SpotifyService.clientId,
	      scope: scope,
	      redirect_uri: SpotifyService.redirectUri,
	      state: state
	    }));

  }
};
