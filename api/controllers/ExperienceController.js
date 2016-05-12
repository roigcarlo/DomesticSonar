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

function calculateExplorer(data) {

  var value = 0

  // Formula is wrong. For the results you want it should be
  // (C1/100 + C2/100 + C3/100 + (1-C4/100))/4
  // Otherwise the value will never be 1
  for(var i in data) {
    value += (
            parseInt(data[i]['Amazing']) +
            parseInt(data[i]['Chills' ]) +
            parseInt(data[i]['Intense']) +
      100 - parseInt(data[i]['Boring' ])
    )/16.0
  }

  return value
}

function displayComfort(res, sTerm, mTerm) {

  // This can be tweaked to match the desired behaviour
  var MAX_SHORT_LENGHT = 1
  var MAX_MEDIUM_LENGHT = 5
  var MATCHES_THRESHLD = 0.6

  // Results
  var isHomebound = 'Homebound'       // We actually don't need this :(
  var homeboundVsTastemaker = 0

  // for now, make the calculations server-side. This can be moved to the
  // client later on
  genresShort = []
  genresMedium = []

  // Make the list with the short term artists genres
  for( var a in sTerm) {
    for( var ag in sTerm[a]['genres']) {
      genresShort.push(sTerm[a]['genres'][ag])
    }
  }
  // Make the list with the medium term artists genres
  for( var a in mTerm) {
    for( var ag in mTerm[a]['genres']) {
      genresMedium.push(mTerm[a]['genres'][ag])
    }
  }

  // Remove duplicities
  var genresShortUnique = genresShort.filter(function(item, pos) {
    return genresShort.indexOf(item) == pos
  })

  var genresMediumUnique = genresMedium.filter(function(item, pos) {
    return genresMedium.indexOf(item) == pos
  })

  // Appply the formulas
  if( genresShortUnique.length <= MAX_SHORT_LENGHT ) {
    isHomebound = 'Homebound'
    homeboundVsTastemaker = 1 // I Assume this is the absolute case
  } else if (genresMediumUnique.length <= MAX_MEDIUM_LENGHT ) {
    isHomebound = 'Homebound'
    homeboundVsTastemaker = 1 // I Assume this is the absolute case
  } else {
    var genresShortInMedium = genresShortUnique.filter(function(item, pos) {
      return genresMediumUnique.indexOf(item) > -1
    })

    var matches = genresShortInMedium.length / genresMediumUnique.length

    if( matches >= MATCHES_THRESHLD ) {
      isHomebound = 'Homebound'
    } else {
      isHomebound = 'Tastemaker'
    }

    homeboundVsTastemaker = matches
  }

  // Retun the view with the data
  return res.view('forms/homebound', {
    genresS:genresShortUnique,
    genresM:genresMediumUnique,
    homebound:{
      result:isHomebound,
      value:homeboundVsTastemaker
    }
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

		var topAristsShort = req.session.topArtistsShort
    var topAristsMedium = req.session.topArtistsMedium

    var NUM_SONGS = 20

		if(topAristsShort && topAristsMedium) {
			console.log('using cached track data')
      displayComfort(
        res,
        req.session.topArtistsShort,
        req.session.topArtistsMedium
      )
			// return res.view('forms/tracks', {tracksShort:topTracks});
		} else {
			console.log('Fetching topTracks data')
			var options_short = {
				url: 'https://api.spotify.com/v1/me/top/artists?limit='+NUM_SONGS+'&time_range=short_term',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};

      var options_medium = {
        url: 'https://api.spotify.com/v1/me/top/artists?limit='+NUM_SONGS+'&time_range=medium_term',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

			// use the access token to access the Spotify Web API
			request.get(options_short, function(error, response, bodyShort) {
        request.get(options_medium, function(error, response, bodyMedium) {
          req.session.topArtistsShort = bodyShort.items
          req.session.topArtistsMedium = bodyMedium.items
          displayComfort(
            res,
            req.session.topArtistsShort,
            req.session.topArtistsMedium
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

  getExplorerScore: function(req, res) {

    console.log(req.body)

    return res.view('forms/scoreBar', {
      left:'Conserver',
      right:'Explorer',
      value: calculateExplorer(req.body)
    });
  }, // desire

};
