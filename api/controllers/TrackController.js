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

    const track = req.param('track')
    const host = req.param('host')
    const port = req.param('port')
    const forceScape = req.param('fs')

    // Get track info from the id
    var options_track_feature = {
      url: 'https://api.spotify.com/v1/audio-features/'+track,
      headers: { 'Authorization': 'Bearer ' + access_token }, // This is a test, no bearer token. Use it with moderation
      json: true
    };

    request.get(options_track_feature, function(error, response, body_track) {
      const dgram = require('dgram');
      const client = dgram.createSocket('udp4');

      console.log(body_track)

      var toSend = JSON.stringify(body_track)

      if(forceScape == 1)
        toSend = toSend.replace(/"/g, '\"')
      if(forceScape == 2)
        toSend = toSend.replace(/"/g, '\\"')
      if(forceScape == 3)
        toSend = toSend.replace(/"/g, '\\\"')

      var message = new Buffer(toSend);
      client.send(message, 0, message.length, port, host, function (err) {
        client.close();
        console.log(toSend)
      });
    });

  }
};
