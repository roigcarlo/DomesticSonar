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
   * `PlayerController.player()`
	 *
	 * Initiales the login request using Spotify credentials
   */
  player: function (req, res) {
    const track = req.param('trackID')
    return res.view('player/player.ejs', {trackID:track})
  },

  changeSong: function(req, res) {
    const track = req.param('trackID')
    sails.sockets.blast('message', { code: 'changeSong', data: track})
    return res.ok()
  },



};
