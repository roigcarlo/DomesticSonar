/**
 * ExperienceController
 *
 * @description :: Server-side logic for managing Experiences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request')
var querystring = require('querystring')

function calculateHomebound() {
  return 75
}

function calculateConserver() {
  return 25
}

function displayComfort(res, sTerm, lTerm) {
  // for now, make the calculations server-side. This can be moved to the
  // client later on

  var comfortSongs = 0
  var comfortGenreS = 0
  var comfortGenreL = 0
  var popuS = 0
  var popuL = 0

  var statistics = {}
      statistics['r_songs'] = []

  var numSongs = 0

  // Sample code that does nothing

  for(var s in sTerm) {
    numSongs += 1
    for(var l in lTerm) {
      if(sTerm[s].name == lTerm[l].name) {
        statistics['r_songs'].push(sTerm[s].name)
        comfortSongs += 1
      }
    }
  }

  // And finally assign an score
  return res.view('forms/homebound', {
    tracksS:sTerm,
    tracksL:lTerm,
    homebound:calculateHomebound(),
  });
}

module.exports = {

  /**
   * `ExperienceController.wellcome()`
   */
  callback: function (req, res) {

		// your application requests refresh and access tokens
	  // after checking the state parameter
		var stateKey = 'spotify_auth_state';

	  var code = req.query.code || null;
	  var state = req.query.state || null;
	  var storedState = req.cookies ? req.cookies[stateKey] : null;

		console.log('code: '+code)
		console.log('state: '+state)
		console.log('storedState: '+storedState)

	  if (state === null || state !== storedState) {
	    res.redirect('/#' +
	      querystring.stringify({
	        error: 'state_mismatch'
	      }));
	  } else {
	    res.clearCookie(stateKey);

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

	    request.post(authOptions, function(error, response, body) {
	      if (!error && response.statusCode === 200) {

					console.log('Requesting new access token')

					req.session.access_token = body.access_token
					req.session.refresh_token = body.refresh_token

					res.redirect('/experience')

					//return res.view('wellcome', {response:body});
	      } else {
	        res.redirect('/error' +
	          querystring.stringify({
	            error: 'invalid_token'
	          }));
	      }
	    }); // request end

	  }
  }, // callback

	wellcome: function(req, res) {

		var access_token = req.session.access_token
		var refresh_token = req.session.refresh_token

		var profileCache = req.session.profileCache

    console.log(profileCache)

		if(profileCache) {
			console.log('Using cache data')
			return res.view('wellcome', {response:profileCache});
		} else {
			console.log('Fetching new data')
			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};

			// use the access token to access the Spotify Web API
			request.get(options, function(error, response, body) {
				 console.log(body);
				 req.session.profileCache = body
				 return res.view('wellcome', {response:body});
			});
		}
	}, // wellcome

	homebound: function(req, res) {

		var access_token = req.session.access_token
		var refresh_token = req.session.refresh_token

		var topTracksShort = req.session.topTracksShort
    var topTracksShort = req.session.topTracksShort

    var NUM_SONGS = 20

		if(topTracksShort && topTracksShort) {
			console.log('using cached track data')
      displayComfort(
        res,
        req.session.topTracksShort,
        req.session.topTracksLong
      )
			// return res.view('forms/tracks', {tracksShort:topTracks});
		} else {
			console.log('Fetching topTracks data')
			var options_short = {
				url: 'https://api.spotify.com/v1/me/top/tracks?limit='+NUM_SONGS+'&time_range=short_term',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};

      var options_long = {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit='+NUM_SONGS+'&time_range=long_term',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

			// use the access token to access the Spotify Web API
			request.get(options_short, function(error, response, bodyShort) {
        request.get(options_long, function(error, response, bodyLong) {
          req.session.topTracksShort = bodyShort.items
          req.session.topTracksLong = bodyLong.items
          console.log(bodyShort)
          console.log(bodyLong)
          displayComfort(
            res,
            req.session.topTracksShort,
            req.session.topTracksLong
          )
        })
      });
		}
	}, // homebound

  explorer: function(req, res) {
    return res.view('forms/explorer', {conserver:33});
	}, // explorer

  desire: function(req, res) {
    return res.view('forms/desire', {response:'body'});
  }, // desire

};
