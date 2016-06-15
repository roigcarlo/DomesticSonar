var nodemailer = require('nodemailer')
var request = require('request')
var querystring = require('querystring')

var mailtemplate = '<div style="width: 500px; background-color: #3f3f3f; padding:40px 0px 20px 0px; text-align: center; color: white; font-family: Arial, Helvetica, sans-serif";>Hi @NAME, here\'s your<br><span style="font-weight: bold">Song</span> for <span style="text-decoration: underline">The Timekeeper</span><div style="width: 250px; background-color: #7ed548; margin:40px 115px 0px 115px; color: white; border-radius: 0.25em; padding: 10px"><br>@BOMB<br><span style="font-size: 24px; font-weight: bold">This is your <br>moment, <br>and this <br>one your <br>song: <br></span><br>@SONG<br><br><br><a style="background-color: #eaeaea; color: black; border-radius: 0.25em; padding: 10px; text-decoration: none;" href="@URL">LISTEN YOUR SONG</a><br><br><br>a project of<br>@DDSLOGO<br><br><br>Proudly co-produced with:<br>@SONARLOGO<br><br><br>In strong collaboration with:<br>@SPOTYLOGO<br><br></div><div style="margin-top: 30px; margin-bottom: 20px; color: #7ed548"><a href="http://domesticstreamers.com/" style="text-decoration: none; color: #7ed548">Check out more experiments</a></div></div>'

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

            if(entryUser != undefined) {
                    // User.update({id:entryUser.id},{released:1}).exec(function(err, updated) {})

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

                      DesireService.getCurated(entryUser.homebound > 60, entryUser.explorer < 50, body.access_token, function(curatedTrack) {

                        sp3uri = curatedTrack.uri.split(':')[2]
                        User.update({id:entryUser.id},{released:0,accessToken:body.access_token,stage3song:sp3uri}).exec(function(err, updated){

                          mailtemplate = mailtemplate.replace('@NAME',entryUser.nick)
                          mailtemplate = mailtemplate.replace('@SONG',curatedTrack.name )
                          mailtemplate = mailtemplate.replace('@URL','https://play.spotify.com/track/'+sp3uri )

                          mailtemplate = mailtemplate.replace('@BOMB','<img src="cid:unique@bomb.ee">')

                          mailtemplate = mailtemplate.replace('@DDSLOGO','<img src="cid:unique@ddslogo.ee">' )
                          mailtemplate = mailtemplate.replace('@SONARLOGO','<img src="cid:unique@sonarlogo.ee">' )
                          mailtemplate = mailtemplate.replace('@SPOTYLOGO','<img src="cid:unique@spotilogo.ee">' )

                          var options_track_feature = {
                            url: 'https://api.spotify.com/v1/audio-features/'+updated[0].stage1song,
                            headers: { 'Authorization': 'Bearer ' + body.access_token },
                            json: true
                          };

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
                                html: mailtemplate,
                                attachments: [
                                  {
                                    filename: 'boom.png',
                                    path: MailDataService.imgp+'boom.png',
                                    cid: 'unique@bomb.ee' //same cid value as in the html img src
                                  },
                                  {
                                    filename: 'ddslogo.png',
                                    path: MailDataService.imgp+'ddslogo.png',
                                    cid: 'unique@ddslogo.ee' //same cid value as in the html img src
                                  },
                                  {
                                    filename: 'sonarlogo.png',
                                    path: MailDataService.imgp+'sonarlogo.png',
                                    cid: 'unique@sonarlogo.ee' //same cid value as in the html img src
                                  },
                                  {
                                    filename: 'spotylogo.png',
                                    path: MailDataService.imgp+'spotylogo.png',
                                    cid: 'unique@spotilogo.ee' //same cid value as in the html img src
                                  }
                              ]
                            };

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function(error, info){
                                if(error){
                                    return console.log(error);
                                }
                                console.log('Message sent: ' + info.response);
                            });
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
