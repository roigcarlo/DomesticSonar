var nodemailer = require('nodemailer');

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'every 15 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            // console.log("Foo job executed");
            //
            // // create reusable transporter object using the default SMTP transport
            // var transporter = nodemailer.createTransport('smtps://sonar@domesticstreamers.com:dibujauncaballo@smtp.domesticstreamers.com');
            //
            //
            // User.findOne({released:0,questionWhere:{'<':Date.now()}}).exec(function checkSessionCode(err, entryUser) {
            //
            //   // setup e-mail data with unicode symbols
            //   var mailOptions = {
            //       from: 'Domestic <hello@DomesticTimeKeeper.com>', // sender address
            //       to: 'roigcarlo@gmail.com, rosa@domesticstreamers.com', // list of receivers
            //       subject: 'Holaaaaaa? funciono?', // Subject line
            //       html: '<span style="color: red;">Tindria que ser rojo pasion aixo.... I am not a robot. This is not spam. Que inyusticia...</span><img src="http://65.media.tumblr.com/6447ad74f837f583b917c7f86735559a/tumblr_inline_o8nrfniqE31qbhmtm_500.gif"></img>' // html body
            //   };
            //
            //   // send mail with defined transport object
            //   transporter.sendMail(mailOptions, function(error, info){
            //       if(error){
            //           return console.log(error);
            //       }
            //       console.log('Message sent: ' + info.response);
            //   });
            //
            // })

            done();
        },
    };
    return job;
}
