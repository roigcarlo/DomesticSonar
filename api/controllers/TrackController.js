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
  sendTrackFeatures: function (req, res) {

    var access_token = req.session.access_token
		var refresh_token = req.session.refresh_token

    const nick = req.param('tk-nick')

    Status.findOne({id:1}).exec(function checkSessionCode(err, entryStatus) {
      if(err || entryStatus == undefined) {
        console.log('No user is bind to the session')
      } else {
        entryStatus.currentUser
        User.findOne({id:entryStatus.currentUser}).exec(function checkSessionCode(err, entryUser) {
          if(err || entryUser == undefined) {
            console.log('User dosn\'t exists')
          } else {
            // Get track info from the id

            var options_list = {
              url: 'https://api.spotify.com/v1/me/top/tracks?limit='+1+'&time_range=medium_term',
              headers: { 'Authorization': 'Bearer ' + entryUser.accessToken },
              json: true
            };

            request.get(options_list, function(error, response, body_list) {

              console.log(body_list.items[0].uri)
              console.log(body_list.items[0].uri.split(':'))
              console.log(body_list.items[0].uri.split(':')[2])
              var track = body_list.items[0].uri.split(':')[2]
              console.log(track)

              var options_track_feature = {
                url: 'https://api.spotify.com/v1/audio-features/'+track,
                headers: { 'Authorization': 'Bearer ' + entryUser.accessToken }, // This is a test, no bearer token. Use it with moderation
                json: true
              };

              request.get(options_track_feature, function(error, response, body_track) {
                const dgram = require('dgram');
                const client = dgram.createSocket('udp4');

                body_track['userID'] = entryUser.id
                body_track['nick'] = nick

                if(entryUser.homebound > 60 && entryUser.explorer > 50)
                  body_track['usertype'] = 1
                else if(entryUser.homebound <= 60 && entryUser.explorer >  50)
                  body_track['usertype'] = 2
                else if(entryUser.homebound <= 60 && entryUser.explorer <= 50)
                  body_track['usertype'] = 3
                else
                  body_track['usertype'] = 4

                body_track['phase'] = 1
                body_track['releaseTime'] = 1

                console.log(body_track)

                var toSend = JSON.stringify(body_track)

                toSend = toSend.replace(/"/g, '\"')

                var message = new Buffer(toSend);
                client.send(message, 0, message.length, TimeKeeperService.port, TimeKeeperService.host, function (err) {
                  client.close();
                  console.log(toSend)
                })
              })
            })
          }
        })
      }
    })
  }

};
