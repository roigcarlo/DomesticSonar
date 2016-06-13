/**
 * TrackController
 *
 * @description :: Server-side logic for dealing with Tracks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request = require('request')
 var querystring = require('querystring')


function sendDatagram(homebound, explorer, body_track, phase, releaseTime, replaceTrackURI) {
  const dgram   = require('dgram');
  const client  = dgram.createSocket('udp4');

  body_track['userID'] = entryUser.id
  body_track['nick'] = nick

  if(homebound > 60 && explorer > 50)
    body_track['usertype'] = 1
  else if(homebound <= 60 && explorer >  50)
    body_track['usertype'] = 2
  else if(homebound <= 60 && explorer <= 50)
    body_track['usertype'] = 3
  else
    body_track['usertype'] = 4

  body_track['phase'] = phase
  body_track['releaseTime'] = releaseTime

  if(replaceTrackURI != undefined)
    body_track['uri'] = replaceTrackURI

  console.log(body_track)

  var toSend = JSON.stringify(body_track)

  toSend = toSend.replace(/"/g, '\"')

  var message = new Buffer(toSend);
  client.send(message, 0, message.length, TimeKeeperService.port, TimeKeeperService.host, function (err) {
    client.close();
    console.log(toSend)
  })
}


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
        entryStatus.currentUser
        User.findOne({id:entryStatus.currentUser}).exec(function checkSessionCode(err, entryUser) {
          if(err || entryUser == undefined) {
            console.log('User dosn\'t exists')
          } else {

            DesireService.getMostListened(entryUser.accessToken, function(track){

              var uri = track.uri.split(':')[2]

              User.update({id:entryStatus.currentUser},{stage1song:uri}).exec(function checkSessionCode(err, updated) {
                var options_track_feature = {
                  url: 'https://api.spotify.com/v1/audio-features/'+uri,
                  headers: { 'Authorization': 'Bearer ' + entryUser.accessToken }, // This is a test, no bearer token. Use it with moderation
                  json: true
                };

                request.get(options_track_feature, function(error, response, body_track) {
                  sendDatagram(entryUser, body_track, 1, 1, undefined)
                })
              })
            })
          }
        })
      }
    })
  },

  // Don't use this yet.
  calculateDesireSong: function curatedSong(req, res) {

    var hvt = parseInt(req.body['hvt'])
    var cve = parseInt(req.body['cve'])

    // Get access token with the refresh token

    // Get the most listened song data

    // Calculate the curated song

    // Send the datagram

    // Send the mail

    User.find(userId)

    var access_token = req.session.access_token
    var refresh_token = req.session.refresh_token

    var callback = function(track) {
      sendDatagram(homebound, explorer, body_track, phase, releaseTime, replaceTrackURI)
      sendDatagram()
    }

    getCurated(hvt, cve, access_token, callback)

  },


};
