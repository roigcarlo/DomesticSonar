/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request      = require('request')
 var querystring  = require('querystring')

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
var sessionCode = 'INV'


module.exports = {

  /**
   * `LoginController.login()`
	 *
	 * Initiales the login request using Spotify credentials
   */
  login: function (req, res) {

		var state = generateRandomString(16);
		var scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';

    sessionCode = req.param('sessionCode')

		res.cookie(stateKey, state);

		res.redirect('https://accounts.spotify.com/authorize?' +
	    querystring.stringify({
	      response_type: 'code',
	      client_id: SpotifyService.clientId,
	      scope: scope,
	      redirect_uri: SpotifyService.redirectUri,
	      state: state
	    })
    );
  },

  /**
   * `LoginController.callback()`
	 *
	 * Fills the basic information for the server to be able to
   * calculate the user information and shows the user some information
   * about its stats, etc...
   */
  callback: function (req, res) {

    // Requests refresh and access tokens
	  // after checking the state parameter
		var stateKey = 'spotify_auth_state';

	  var code         = req.query.code  || null;
	  var state        = req.query.state || null;
	  var storedState  = req.cookies ? req.cookies[stateKey] : null;

	  if (state === null || state !== storedState) {
	    res.redirect('/#' +
	      querystring.stringify({
	        error: 'state_mismatch'
	      }));
	  } else {
	    res.clearCookie(stateKey);

      // Resquest an authorization for our app
			var authOptions = {
	      url: 'https://accounts.spotify.com/api/token',
	      form: {
	        code: code,
	        redirect_uri: SpotifyService.redirectUri,
	        grant_type: 'authorization_code'
	      },
	      headers: {
	        'Authorization': 'Basic ' + (new Buffer(SpotifyService.clientId + ':' + SpotifyService.clientSecret).toString('base64'))
	      },
	      json: true
	    };

      // If the result is ok, request the user information
	    request.post(authOptions, function(error, response, authBody) {
	      if (!error && response.statusCode === 200) {

					console.log('Requesting new access token')

          var profileOptions = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + authBody.access_token },
            json: true
          };

          // Update the access information
          req.session.access_token = authBody.access_token
          req.session.refresh_token = authBody.refresh_token

          // Use the access token to access the Spotify Web API
          request.get(profileOptions, function(error, response, profilebody) {
            console.log('Requesting profile')

            // Update the user information.
            if(!error && response.statusCode === 200) {

              // Create the user profile if not exists.
              User.findOrCreate(
                {mail:profilebody.email},
                {
                  mail: profilebody.email,
                  name: profilebody.display_name,
                  accessToken: authBody.access_token,
                  refreshToken: authBody.refresh_token,
                }
              ).exec(function checkUser(err, entryUser) {
                if (err) {
                  console.log('Error')
                  res.redirect('/error')
                } else {
                  // If the user already has finished his experience, the status does not
                  // matter and key is not used
                  if('releaseOn' in entryUser && entryUser.releaseOn != null) {
                    console.log('User already performed the test')
                    res.redirect('/experience')
                  } else {
                    // A session must always exitst, but just in case we create an invalid
                    // session if not
                    Status.findOrCreate({id:1},{id:1,}).exec(function checkSessionCode(err, entryStatus) {
                      console.log('CheckSessionCode')
                      // If the user is logged and the slot requested is available
                      if('sessionId' in entryStatus && entryStatus.sessionId == sessionCode) {
                        // If the session is valid
                        sails.sockets.blast('message', { code: 'RemoteLoginAction' });
                        Status.update({id:1},{currentUser:entryUser.id,}).exec(function checkSessionCode(err, updated) {
                          console.log('UserRemotelyLogged')
                          res.redirect('/experience')
                        })
                      } else {
                        // Otherwise
                        console.log('session code E,I:',entryStatus.sessionId,sessionCode)
                        res.redirect('/error')
                      }
                    });
                  }
                }
              })
            } else {
              res.redirect('/error' +
                querystring.stringify({
                  error: 'invalid_profile'
                }));
            }
          });
	      } else {
	        res.redirect('/error' +
	          querystring.stringify({
	            error: 'invalid_token'
	          }));
	      }
	    }); // request end
	  }
  }, // callback

};
