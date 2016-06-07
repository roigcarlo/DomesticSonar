/**
 * ExperienceController
 *
 * @description :: Server-side logic for managing Experiences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request')
var querystring = require('querystring')

function compueteHomeboundness(res, sTerm, mTerm, userId) {

  console.log('computing value...')

  // This can be tweaked to match the desired behaviour
  var MAX_SHORT_LENGHT = 1
  var MAX_MEDIUM_LENGHT = 5
  var MATCHES_THRESHLD = 0.6

  // Results
  // var isHomebound = 'Homebound'       // We actually don't need this :(
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
    homeboundVsTastemaker = 1 // I Assume this is the absolute case
  } else if (genresMediumUnique.length <= MAX_MEDIUM_LENGHT ) {
    homeboundVsTastemaker = 1 // I Assume this is the absolute case
  } else {
    var genresShortInMedium = genresShortUnique.filter(function(item, pos) {
      return genresMediumUnique.indexOf(item) > -1
    })

    var matches = genresShortInMedium.length / genresMediumUnique.length

    matches = matches < 0 ? 0 : matches
    matches = matches > 1 ? 1 : matches

    homeboundVsTastemaker = matches
  }

  homeboundVsTastemaker *= 100

  User.update({id:userId},{homebound:homeboundVsTastemaker}).exec(function (err, updated) {
    console.log('Updated user Homeboundness:')
    console.log(updated)
    res.ok(homeboundVsTastemaker);
  })
}

function computeExploreness(res, data, userId) {

  console.log('computing value...')

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

  User.update({id:userId},{explorer:value}).exec(function (err, updated) {
    console.log('Updated user Exploreness:')
    console.log(updated)
    res.ok(value);
  })
}

module.exports = {

	reward: function(req, res) {

		var access_token = req.session.access_token
		var refresh_token = req.session.refresh_token

		var profileCache = req.session.profileCache
    var validProfile = req.session.validProfile

		var options = {
			url: 'https://api.spotify.com/v1/me',
			headers: { 'Authorization': 'Bearer ' + access_token },
			json: true
		}

		// use the access token to access the Spotify Web API
		request.get(options, function(error, response, body) {
      if(!error && response.statusCode === 200) {
			   req.session.profileCache = body
			   return res.view('wellcome', {response:body});
      }
      else {
        res.redirect('/error' +
          querystring.stringify({
            error: 'invalid_profile'
          }))
      }
		})

	},

	calculateHomeboundness: function(req, res) {

    console.log('Calculating Homeboundness')

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {
        entryStatus.currentUser
        User.findOne({id:entryStatus.currentUser}).exec(function checkSessionCode(err, entryUser) {
          if(err || entryUser == undefined) {
            console.log('User dosn\'t exists')
          } else {

            const NUM_SONGS = 20

            var options_short = {
      				url: 'https://api.spotify.com/v1/me/top/artists?limit='+NUM_SONGS+'&time_range=short_term',
      				headers: { 'Authorization': 'Bearer ' + entryUser.accessToken },
      				json: true
      			};

            var options_medium = {
              url: 'https://api.spotify.com/v1/me/top/artists?limit='+NUM_SONGS+'&time_range=medium_term',
              headers: { 'Authorization': 'Bearer ' + entryUser.accessToken },
              json: true
            };

            // Use the access token to access the Spotify Web API
            request.get(options_short, function(error, response, bodyShort) {
              request.get(options_medium, function(error, response, bodyMedium) {
                req.session.topArtistsShort = bodyShort.items
                req.session.topArtistsMedium = bodyMedium.items

                console.log('Fetched user artist preferences')

                compueteHomeboundness(res,
                  req.session.topArtistsShort,
                  req.session.topArtistsMedium,
                  entryStatus.currentUser
                )

              })
            })
          }
        })
      }
    })

	}, // calculateHomeboundness

  calculateExplorerness: function(req, res) {

    console.log('Calculating Exploreness')

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {
        entryStatus.currentUser
        User.findOne({id:entryStatus.currentUser}).exec(function checkSessionCode(err, entryUser) {
          if(err || entryUser == undefined) {
            console.log('User dosn\'t exists')
          } else {
            computeExploreness(res, req.body, entryStatus.currentUser)
          }
        })
      }
    })

  },

  // Don't use this yet.
  calculateDesireSong: function calculateDesireSong(req, res) {

    var hvt = parseInt(req.body['hvt'])
    var cve = parseInt(req.body['cve'])

    var access_token = req.session.access_token
		var refresh_token = req.session.refresh_token

    // Homebound - Conserver
    if(hvt && cve) {
      // Most listened song of the last month
      console.log('Fetching topTracks data')
      var options_short = {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit='+1+'&time_range=medium_term',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      request.get(options_short, function(error, response, body_track) {
        return res.view('forms/track', {
          track:body_track.items[0]
        });
      });
    }

    // Homebound - Explorer
    if(hvt && !cve) {
      // 1. Most listened track
      // 2. get artists
      // 3. get similar artist
      // 4. get it's top track

      // 1 + 2.
      var options_track = {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit='+1+'&time_range=medium_term',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      request.get(options_track, function(error, response, body_track) {

        // 3.
        var options_s_artist = {
          url: 'https://api.spotify.com/v1/artists/'+body_track.items[0].artists[0].id+'/related-artists',
          json: true
        };

        request.get(options_s_artist, function(error, response, body_s_artist) {
          // 4.
          var options_s_track = {
            url: 'https://api.spotify.com/v1/artists/'+body_s_artist.artists[0].id+'/top-tracks?country='+req.session.profileCache.country,
            json: true
          };

          request.get(options_s_track, function(error, response, body_s_track) {
            console.log(body_s_track.tracks[0])
            return res.view('forms/track', {
              track:body_s_track.tracks[0]
            });
          });
        });
      });
    }

    // Tastemaker - Conserver
    if(!hvt && cve) {
      // Song from discovery week
      var options_playlist = {
        url: 'https://api.spotify.com/v1/users/'+req.session.profileCache.id+'/playlists',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      console.log(req.session.profileCache.id)

      request.get(options_playlist, function(error, response, body_playlist) {

        var discovery
        for( var pl in body_playlist.items) {
          if(body_playlist.items[pl].uri.split(':')[2] == 'spotifydiscover') {
            discovery = body_playlist.items[pl].id
          }
        }

        console.log(discovery)

        var options_track = {
          url: 'https://api.spotify.com/v1/users/spotifydiscover/playlists/'+discovery+'/tracks?limit=1',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options_track, function(error, response, body_track) {
          return res.view('forms/track', {
            track:body_track.items[0].track
          });
        });
      });

    }

    // Tastemaker - Explorer
    if(!hvt && !cve) {
      // Song from discovery week
      var options_playlist = {
        url: 'https://api.spotify.com/v1/users/spotify/playlists',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      console.log(req.session.profileCache.id)

      var options_track = {
        url: 'https://api.spotify.com/v1/users/spotify/playlists/3rgsDhGHZxZ9sB9DQWQfuf/tracks?limit=1',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      request.get(options_track, function(error, response, body_track) {
        console.log(body_track.items[0].track)
        return res.view('forms/track', {
          track:body_track.items[0].track
        });
      });

    }
  },

  // Unused. Legacy
  explorer: function(req, res) {
    return res.view('forms/explorer', {conserver:33});
	}, // explorer

  // Unused. Legacy
  desire: function(req, res) {
    return res.view('forms/desire', {response:'body'});
  }, // desire

};
