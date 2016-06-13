/**
 * InterruptController
 *
 * @description :: Server-side logic for dealing with Interruptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 /**
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
 var generateRandomString = function(length) {
   var text = '';
   var possible = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };

/**
 * Sends to the timekeeper the top song of the recently logged user
 * @TODO: What happens if the user does not have a top song?
 */
function timeKeeperSendProfileSong() {

  console.log('Seding Top track to the TimeMachine')

  const access_token  = req.session.access_token
  const refresh_token = req.session.refresh_token

  var optionsTopTrack = {
    url: 'https://api.spotify.com/v1/me/top/tracks?limit='+1+'&time_range=medium_term',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  request.get(options_short, function(error, response, body_track) {
    const dgram = require('dgram');
    const client = dgram.createSocket('udp4');

    // Build the json
    var toSend = JSON.stringify(body_track)
    toSend = toSend.replace(/"/g, '\"')

    // Add missing fields

    // Send The message
    var message = new Buffer(toSend);
    client.send(
      message,
      0,
      message.length,
      TimeKeeperService.port,
      TimeKeeperService.host,
      function (err) {
        client.close();
        console.log('Sent Info to TimeKeeper:', toSend)
      }
    );
  });
 }

module.exports = {

    startPhase1: function (req, res) {
      // Retrieve the current session or create an new one if empty
      Status.findOrCreate({id:1},{id:1}).exec(function checkSessionCode(err, entry) {
        if( 'accessToken'  in entry && entry.accessToken  != null &&
            'refreshToken' in entry && entry.refreshToken != null ) {

          // Update session
          req.session.access_token  = entry.accessToken
          req.session.refresh_token = entry.refreshToken

          // Send the top song to the timeKeeper
          timeKeeperSendProfileSong()
        }
        res.ok();
      });
    },

    startPhase2: function (req, res) {
      // Retrieve the current session or create an new one if empty
      Status.findOrCreate({id:1},{id:1}).exec(function checkSessionCode(err, entry) {
        Status.update({id:1},{sessionId:slotCode,stage:2})
      });
    },

    startPhase3: function (req, res) {
      // Retrieve the current session or create an new one if empty
      Status.findOrCreate({id:1},{id:1}).exec(function checkSessionCode(err, entry) {
        Status.update({id:1},{sessionId:slotCode,stage:3})
      });
    },

    startPhase4: function (req, res) {
      // Retrieve the current session or create an new one if empty
      Status.findOrCreate({id:1},{id:1}).exec(function checkSessionCode(err, entry) {
        Status.update({id:1},{sessionId:slotCode,stage:4})
      });
    },

    createNewSession: function (req, res) {
      // Retrieve the current session or create an new one if empty
      Status.findOrCreate({id:1},{id:1}).exec(function checkSessionCode(err, entry) {
        console.log('Generating new session')
        var slotCode = generateRandomString(10)
        Status.update({id:1},{sessionId:slotCode}).exec(function checkSessionCode(err, updated) {
          console.log(updated)
          console.log(slotCode)
          res.send(slotCode);
        });
      });
    },
};
