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
    res.send(200, homeboundVsTastemaker);
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
    res.send(200, value);
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

  updateShare: function(req, res) {

    const share = req.param('share') ? true : false;

    console.log("SHARE",share)

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {
        User.update({id:entryStatus.currentUser},{shares:share}).exec(function checkUpdate(error, updated) {
          res.ok();
        })
      }
    })

  },

  createDesire: function(req, res) {

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {
        User.update({id:entryStatus.currentUser}, {
          nick:tknick,
          questionWhen:'',
          questionWhere:tkwhere,
          questionWith:tkwith,
          questionDoing:tkdoing,
          questionFeeling:tkfeeling,
        }).exec(function checkUpdate(error, updated) {
          res.ok();
        })
      }
    })
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
