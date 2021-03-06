/**
 * TrackController
 *
 * @description :: Server-side logic for dealing with Tracks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request = require('request')
 var querystring = require('querystring')



module.exports = {

  /**
   * `LoginController.login()`
	 *
	 * Initiales the login request using Spotify credentials
   */
  updateMostListenedSong: function (req, res) {

    const nick = req.param('tk-nick')

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {

        Status.update({id:1},{stage:1}).exec(function(err, updated){})
        User.findOne({id:entryStatus.currentUser}).exec(function checkSessionCode(err, entryUser) {

          if(err || entryUser == undefined) {
            console.log('User dosn\'t exists')
          } else {

            // Resquest an authorization for our app
            var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              form: {
                grant_type: 'refresh_token',
                refresh_token: entryUser.refreshToken,
              },
              method: 'POST',
              headers: {
                'Authorization': 'Basic ' + (new Buffer(SpotifyService.clientId + ':' + SpotifyService.clientSecret).toString('base64'))
              },
              json: true
            };

            request.post(authOptions, function(error, response, body) {

                  DesireService.getMostListened(body.access_token, function(track){

                    var uri = track.uri.split(':')[2]
                    console.log('Trac',track)

                    User.update({id:entryStatus.currentUser},{stage1song:uri}).exec(function checkSessionCode(err, updated) {
                      var options_track_feature = {
                        url: 'https://api.spotify.com/v1/audio-features/'+uri,
                        headers: { 'Authorization': 'Bearer ' + body.access_token },
                        json: true
                      };

                      request.get(options_track_feature, function(error, response, body_track) {
                        sails.sockets.blast('message', { code: 'SongStartPlaying' });
                        DesireService.sendDatagram(entryUser.id, entryUser.nick, entryUser.homebound, entryUser.explorer, body_track, 1, Math.round( (parseInt(entryUser.questionWhen) - Date.now()) / 3600000), undefined, undefined, undefined)
                      })
                    })
                  })
            })
          }
        })
      }
    })
  },

};
