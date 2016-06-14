var nodemailer = require('nodemailer');

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'every 5 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
          console.log("Foo job executed...");

          User.findOne({released:0,questionWhere:{'<':Date.now()},sort:'questionWhere DESC'}).exec(function freeDesire(err, entryUser) {

            // Resquest an authorization for our app
            var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              form: {
                grant_type: 'refresh_token',
                refresh_token: entryUser.refreshToken,
              },
              headers: {
                'Authorization': 'Basic ' + (new Buffer(SpotifyService.clientId + ':' + SpotifyService.clientSecret).toString('base64'))
              },
              json: true
            };

            request.get(authOptions, function(error, response, body) {
              DesireService.getCurated(updated.homebound, updated.explorer, body.access_token, function(curatedTrack) {
                sp3uri = curatedTrack.uri.split(':')[2]
                User.update({id:entryUser.id},{released:1,accessToken:body.access_token,stage3song:sp3uri}).exec(function(err, updated){
                  var options_track_feature = {
                    url: 'https://api.spotify.com/v1/audio-features/'+updated.stage1song,
                    headers: { 'Authorization': 'Bearer ' + entryUser.accessToken }, // This is a test, no bearer token. Use it with moderation
                    json: true
                  };

                  request.get(options_track_feature, function(error, response, body_track) {
                    DesireService.sendDatagram(updated.homebound, updated.explorer, body_track, 3, 1, sp3uri)

                    // create reusable transporter object using the default SMTP transport
                    var poolConfig = {
                        host: MailDataService.host,
                        port: MailDataService.port,
                        secure: true, // use SSL
                        auth: {
                            user: MailDataService.user,
                            pass: MailDataService.pswd,
                        }
                    };
                    var transporter = nodemailer.createTransport(poolConfig);

                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: 'Domestic <hello@DomesticTimeKeeper.com>', // sender address
                        to: updated.mail, // list of receivers
                        subject: 'YourDesire', // Subject line
                        html: 'Test' // html body
                    };
                  })
                })
              })
            }

          }

          done();
        },
    };
    return job;
}
