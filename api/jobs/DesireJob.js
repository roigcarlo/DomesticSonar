var nodemailer = require('nodemailer')
var request = require('request')
var querystring = require('querystring')

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'every 15 seconds',

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

            // console.log(entryUser)

            if(entryUser != undefined) {

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

                      // console.log('refreshTokenRequest', body.acces_token, entryUser.accessToken)

                      DesireService.getCurated(entryUser.homebound > 60, entryUser.explorer < 50, body.access_token, function(curatedTrack) {

                        // console.log('curated song', curatedTrack)

                        sp3uri = curatedTrack.uri.split(':')[2]
                        User.update({id:entryUser.id},{released:0,accessToken:body.access_token,stage3song:sp3uri}).exec(function(err, updated){

                          //console.log(err,updated)

                          var options_track_feature = {
                            url: 'https://api.spotify.com/v1/audio-features/'+updated[0].stage1song,
                            headers: { 'Authorization': 'Bearer ' + body.access_token },
                            json: true
                          };

                          // console.log('========>','https://api.spotify.com/v1/audio-features/'+updated[0].stage1song)

                          request.get(options_track_feature, function(error, response, body_track) {
                            DesireService.sendDatagram(updated[0].id, updated[0].nick, updated[0].homebound, updated[0].explorer, body_track, 3, 1, sp3uri, curatedTrack.name, curatedTrack.artists[0].name)

                            // create reusable transporter object using the default SMTP transport
                            var poolConfig = {
                                host: MailDataService.host,
                                port: MailDataService.port,
                                secure: false, // use SSL
                                ignoreTLS: true,
                                auth: {
                                    user: MailDataService.user,
                                    pass: MailDataService.pswd,
                                }
                            };

                            var transporter = nodemailer.createTransport(poolConfig);

                            // setup e-mail data with unicode symbols
                            var mailOptions = {
                                from: 'TimeKeeper <sonar@domesticstreamers.com>', // sender address
                                to: updated[0].mail, // list of receivers
                                subject: 'YourDesire', // Subject line
                                html: '<span>'+JSON.stringify(updated[0])+'</span>' // html body
                            };

                            // send mail with defined transport object
                            // transporter.sendMail(mailOptions, function(error, info){
                            //     if(error){
                            //         return console.log(error);
                            //     }
                            //     console.log('Message sent: ' + info.response);
                            // });
                          })
                        })
                      })
                    })
            }
          })

          done();
        },
    };
    return job;
}
