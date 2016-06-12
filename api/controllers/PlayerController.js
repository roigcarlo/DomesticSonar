/**
 * TrackController
 *
 * @description :: Server-side logic for dealing with Tracks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request = require('request')
 var querystring = require('querystring')


function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


module.exports = {

  /**
   * `PlayerController.player()`
	 *
	 * Initiales the login request using Spotify credentials
   */
  player: function (req, res) {

    const track = req.param('trackID')
    return res.view('player/player.ejs', {trackID:track})

    // var oauth_token = {
    //   url: 'https://open.spotify.com/token',
    //   json: true
    // };
    //
    // request.get(oauth_token, function(error, response, otoken) {
    //
    //   var cauth_token = {
    //     url: 'https://'+makeid()+'.spotilocal.com:4371/simplecsrf/token.json',
    //     headers: {
    //       'Referer': 'https://embed.spotify.com/remote-control-bridge/',
    //       'Origin': 'https://embed.spotify.com/'
    //     },
    //     'rejectUnauthorized': false,
    //     json: true
    //   };
    //
    //   request.get(cauth_token, function(error, response, ctoken) {
    //     console.log(error,ctoken)
    //     const track = req.param('trackID')
    //     return res.view('player/player.ejs', {trackID:track,auth_token :otoken['t'],csrf_token : ctoken['token']})
    //   })
    // })
  },

  changeSong: function(req, res) {
    const track = req.param('trackID')
    sails.sockets.blast('message', { code: 'changeSong', data: track})
    return res.ok()
  },



};
