var request = require('request')
var querystring = require('querystring')

module.exports = {

  getMostListened: function(access_token, callback) {
    var options_list = {
      url: 'https://api.spotify.com/v1/me/top/tracks?limit='+1+'&time_range=medium_term',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };

    request.get(options_list, function(error, response, body_list) {
      console.log(error,body_list)
      callback(body_list.items[0])
    })
  },

  getCurated: function(hvt, cve, access_token, callback) {

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
        console.log('DesireService',error,body_track)
        if(body_track) {
          if(body_track.items && body_track.items[0]){
            console.log(callback)
            callback(body_track.items[0])
          }
        }
        // return body_track.items[0]
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
            callback(body_s_track.tracks[0])
            // return body_s_track.tracks[0]
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
          callback(body_track.items[0].track)
          // return body_track.items[0].track
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

      var options_track = {
        url: 'https://api.spotify.com/v1/users/spotify/playlists/3rgsDhGHZxZ9sB9DQWQfuf/tracks?limit=1',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      request.get(options_track, function(error, response, body_track) {
        callback(body_track.items[0].track)
        // return body_track.items[0].track
      });

    }
  },

  sendDatagram: function (id, nick, homebound, explorer, body_track, phase, releaseTime, replaceTrackURI, curatedTrack, curatedArtist) {
    const dgram   = require('dgram');
    const client  = dgram.createSocket('udp4');

    body_track['userID'] = id
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
      body_track['uri'] = replaceTrackURI.replace(' ','_')
    if(replaceTrackURI != undefined)
      body_track['curatedArtist'] = curatedArtist.replace(' ','_')
    if(replaceTrackURI != undefined)
      body_track['curatedTrack'] = curatedTrack.replace(' ','_')

    console.log(body_track)

    var toSend = JSON.stringify(body_track)

    toSend = toSend.replace(/"/g, '\"')

    var message = new Buffer(toSend);
    client.send(message, 0, message.length, TimeKeeperService.port, TimeKeeperService.host, function (err) {
      client.close();
      console.log('SENT!',err)
    })
  }
}
