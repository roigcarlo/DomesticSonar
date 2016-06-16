const TEXT_SPEED = -20

var homebound = 0
var explorer = 0
var userShare = 0
var interval = 0

function setShare(val) {
  userShare = val

  // Update sharing
  $.ajax({
    url: '/updateShare',
    method: 'POST',
    data: {share: userShare}
  })

}

function getTyped() {

  var evc = explorer > 50
    ? '<span> You know what you like and you know where you can find it. That\'s why you like to stay in your area of comfort, making you a great </span> <span class="typed-text spotygreen"> Traditionalist </span>'
    : '<span> Where to next? <br> Always looking for <br> something else, <br> you are good <br> with words like change, <br> shift or mutation, <br> you are an </span> <span class="typed-text spotygreen"> Explorer. </span>'

  var hvt = homebound > 60
    ? '<span> Hey there </span> <span class="typed-text spotygreen"> Homebound! </span> <br> <span> Seems like you\'ve got <br> your music taste <br> pretty clear, <br> you like to listen to <br> the same kind of <br> music all the time, <br> staying in a <br> tune comfort zone. <br> Play on repeat! </span>'
    : '<span> Hey there </span> <span class="typed-text spotygreen"> Tastemaker! </span> <br> Seems like you like <br> exploring new tunes,  <br> constantly in search <br> of new musical <br> expriences. <br> Shuffle mode on! </span>'

  var names = [
    'Jordi', 'Sam', 'Carles', 'Frank', 'Dani', 'Pau', 'Iolanda', 'Chus', 'Lotte', 'Sharon', 'Edgar', 'Alex', 'Pol', 'Oscar', 'Mariona', 'Alexandra', 'Axel', 'Charlie',
    'Joan', 'Rouse', 'Jackie chan', 'Drake', 'Harry potter', 'Han solo', 'Chewaka', 'Marty McFly', 'Mark'
  ]

  return {
    'app-1': {
      strings: ['<span class="typed-text spotygreen">Hello </span> <span id="typed-name">Mark</span> <br> <span class="typed-text">You are about to <br> create a future <br> moment while <br> becoming part of <br> a collective scientific <br> experiment on human <br>  behaviors.</span>'],
      contentType: 'html',
      typeSpeed: TEXT_SPEED,
      showCursor: false,
      callback: function () {
        $("#typed-name").typed({
          strings: names,
          contentType: 'html',
          typeSpeed: TEXT_SPEED,
          loop: true,
          showCursor: true,
          cursorChar: '_',
          backDelay: 2500,
        });

        mySwiper.unlockSwipeToNext()
        $('.swiper-slide.swiper-slide-active .footer-inside').show()
      }
    },

    'app-2':{
      strings: ['<span> In order to be able to <br> curate a perfect song <br> for your future <br> moment first we need <br> to know a bit <br> more about you. <br> <br> Ready to reveal your <br> musical habits and <br> personality traits? <br> Here we go! </span>'],
      contentType: 'html',
      typeSpeed: TEXT_SPEED,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
        $('.swiper-slide.swiper-slide-active .footer-inside').show()
      }
    },

    'app-6':{
      strings: ['<span> Time for the <br> </span> <span class="typed-text spotygreen"> Five Factor Model Test </span> <span> <br> a crazy test that <br> psychologists use to <br> understand human <br> behavior. </span>'],
      contentType: 'html',
      typeSpeed: TEXT_SPEED,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
        $('.swiper-slide.swiper-slide-active .footer-inside').show()
      }
    },

    'app-9':{
      strings: [evc],
      contentType: 'html',
      typeSpeed: TEXT_SPEED,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
        $('.swiper-slide.swiper-slide-active .footer-inside').show()
      }
    },

    'app-10':{
      strings: [hvt],
      contentType: 'html',
      typeSpeed: TEXT_SPEED,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
        $('.swiper-slide.swiper-slide-active .footer-inside').show()
      }
    },

  }
}

function initialize(swiper) {
  var prev = $('.swiper-slide.swiper-slide-prev').attr('href')
  var actv = $('.swiper-slide.swiper-slide-active').attr('href')
  var next = $('.swiper-slide.swiper-slide-next').attr('href')

  $('.footer-inside.hideable').hide()

  resetTyped(prev, actv, next)
  initTyped( prev, actv, next)
  lockSlide( prev, actv, next, swiper, [
    'app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad',
    'app-6', 'app-7', 'app-9', 'app-10', 'app-12'
  ])
}

function reset(swiper) {
  $('#SendButton').prop('disabled', true);
  $('#SendButton').css('background-color','rgb(75, 75, 75)')
  clearInterval(interval);
  mySwiper.unlockSwipeToPrev()
  mySwiper.slideTo(0, 1)
  $(".swiper-slide #message").typed('reset')
  mySwiper.lockSwipeToPrev()
  initialize(swiper)
  $('#tk-data input').each(function() {
    this.value = ''
  })

  var images = ['#explorerImage0', '#explorerImage1', '#explorerImage2', '#explorerImage3']
  for(var i in images) {
    $(images[i]+' .sliders').each(function(){
      $(this)[0].noUiSlider.set(50);
    })
  }

  $('#sessionCode').html('Waiting for code')
}

function resetTyped(prev, actv, next) {
  $(".swiper-slide.swiper-slide-next #message").typed('reset')
}

function resetWheel(prev, actv, next, swiper, onSlide, drawProgress) {
  if(onSlide.indexOf(actv) >= 0) {
    var $pCaption = $('.progress-wheel p');
    var iProgress = $('.inactiveProgress');
  	var aProgress = $('.activeProgress');

    aProgress.each(function() {
      drawProgress(this, 0, $pCaption);
    })
  }
}

function initTyped(prev, actv, next) {
  $(".swiper-slide.swiper-slide-active #message").typed(getTyped()[actv])
}

function initWheel(actv, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {

    var progress = 0
    $(".progressLabel").html(progress)
    interval = setInterval(function() {
      progress += 0.80;
      $(".progressLabel").html(Math.round(progress))
      if (progress >= 100) {
        clearInterval(interval);
        $(".progressLabel").html(100)
        setTimeout(function () {
          swiper.unlockSwipeToNext()
          swiper.slideNext(true, 1000)
        }, 750)
      }
    }, 50)
  }
}

function lockSlide(prev, actv, next, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {
    swiper.lockSwipeToNext()
  }
}

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60));
   return this;
}

Date.prototype.addDays = function(d) {
   this.setTime(this.getTime() + (d*24*60*60));
   return this;
}

Date.prototype.addMonths = function(m) {
   this.setTime(this.getTime() + (m*30*24*60*60));
   return this;
}

function SimulateSend() {

  console.log($('#tk-hours').val(), $('#tk-days').val(), $('#tk-months').val())

  var releaseDate = new Date();
  var currentDate = new Date();

  releaseDate.addHours($('#tk-hours').val())
  releaseDate.addDays($('#tk-days').val())
  releaseDate.addMonths($('#tk-months').val())

  console.log( ( releaseDate.getTime() - currentDate.getTime() ) / 3600 )

}

function SendFormTK() {
  var data = {}

  $('#tk-data input').each(function() {
    data[this.id] = this.value
  })


  var releaseDate = new Date();

  console.log($('#tk-hours').val(), $('#tk-days').val(), $('#tk-months').val())

  releaseDate.addHours($('#tk-hours').val()+4)
  releaseDate.addDays($('#tk-days').val())
  releaseDate.addMonths($('#tk-months').val())

  data['tk-when'] = releaseDate.getTime()

  $.ajax({
    url: '/createDesire',
    data: data,
    method: 'POST',
  })
  .done(function( data ) {
    console.log('CreatedDesire', data)
    console.log('CalculatingSong', data)

    $.ajax({
      url: '/calculateMostListen',
      method: 'POST',
    }).done(function( data ) {
    }).fail(function (data ) {
    })

  }).fail(function (data ) {
  });

  mySwiper.unlockSwipeToNext()
  mySwiper.slideNext(true, 1000)

  $('#SendButton').prop('disabled', true);
}

function hardReset() {
  reset(mySwiper)
}

function ReleaseMarble() {

  $.ajax({
    url: '/updateMostListenedSong',
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
  })
  .done(function( data ) {
    console.log('Sent to alex', data)
  }).fail(function (data ) {
    console.log('Not sent', data)
  });

  mySwiper.unlockSwipeToNext()
  mySwiper.slideNext(true, 1000)

  setTimeout(function() {
    reset(mySwiper)
  }, 5000)
}

$(document).ready(function () {

  ///////////////////
  // Wheel         //
  ///////////////////
  var $pCaption = $('.progress-wheel p');
	var iProgress = $('.inactiveProgress');
	var aProgress = $('.activeProgress');

  var SlideTimer = 0
  var TimeOutEvent = undefined

  iProgress.each(function() {
    var iProgressCTX = this.getContext('2d');
    drawInactive(iProgressCTX);
  })

	function drawInactive(iProgressCTX){
		iProgressCTX.lineCap = 'square';

		//outer ring
		iProgressCTX.beginPath();
		iProgressCTX.lineWidth = 17;
		iProgressCTX.strokeStyle = '#e1e1e1';
		iProgressCTX.arc(137.5,137.5,129,0,2*Math.PI);
		iProgressCTX.stroke();

		//progress bar
		iProgressCTX.beginPath();
		iProgressCTX.lineWidth = 0;
		iProgressCTX.fillStyle = '#e6e6e6';
		iProgressCTX.arc(137.5,137.5,121,0,2*Math.PI);
		iProgressCTX.fill();

		//progressbar caption
		iProgressCTX.beginPath();
		iProgressCTX.lineWidth = 0;
		iProgressCTX.fillStyle = '#fff';
		iProgressCTX.arc(137.5,137.5,100,0,2*Math.PI);
		iProgressCTX.fill();
	}

	function drawProgress(bar, percentage, $pCaption){
		var barCTX = bar.getContext("2d");
		var quarterTurn = Math.PI / 2;
		var endingAngle = ((2*percentage) * Math.PI) - quarterTurn;
		var startingAngle = 0 - quarterTurn;

		bar.width = bar.width;
		barCTX.lineCap = 'square';

		barCTX.beginPath();
		barCTX.lineWidth = 20;
		barCTX.strokeStyle = 'rgb(57, 194, 95)';
		barCTX.arc(137.5,137.5,111,startingAngle, endingAngle);
		barCTX.stroke();

		$pCaption.text( (parseInt(percentage * 100, 10)) + '%');
	}

  aProgress.each(function() {
    var percentage = 0 / 100;
    console.log(this)
    drawProgress(this, percentage, $pCaption);
  })

  ///////////////////
  // Swiper events //
  ///////////////////
  console.log(mySwiper.on)
  if(mySwiper.on) {
    mySwiper.on('onSlideChangeEnd', function (swiper) {
      var prev = $('.swiper-slide.swiper-slide-prev').attr('href')
      var actv = $('.swiper-slide.swiper-slide-active').attr('href')
      var next = $('.swiper-slide.swiper-slide-next').attr('href')

      resetTyped(prev, actv, next, swiper);
      resetWheel(prev, actv, next, swiper, ['app-3', 'app-7'], drawProgress);

      // Do it on prev because the fucking users start sliding thing at the
      // speed of ligt. Better if its done in locked slides

      // Calculate Homeboundness, can be done asynchronously, no need to wait.
      if(prev == 'app-3') {
        $.ajax({
          url: '/calculateHomeboundness',
          method: 'POST',
        }).done(function( data ) {
          console.log('Homebound data from server', data)
          homebound = data
        }).fail(function (data ) {
          console.log('Fail Homebound data from server', data)
          explorer = data
        });
      }
    })

    mySwiper.on('onSlideChangeStart', function (swiper) {
      clearInterval(interval);
      var prev = $('.swiper-slide.swiper-slide-prev').attr('href')
      var actv = $('.swiper-slide.swiper-slide-active').attr('href')
      var next = $('.swiper-slide.swiper-slide-next').attr('href')

      initTyped(prev, actv, next, swiper);
      initWheel(actv, swiper, ['fakeLoad'])
      lockSlide(prev, actv, next, swiper, [
        'app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad',
        'app-6', 'app-9', 'app-10', 'app-12'
      ])

      // Create an ephimerous session. The remote callback unlocks the app
      if(actv == 'app-3') {
        $.ajax({
          url: '/createNewSession',
          method: 'POST',
        })
        .done(function( data ) {
          $('#sessionCode').html(data)
        });
      }

      // Start the timer
      if(actv == 'app-7') {
        clearInterval(TimeOutEvent);
        var seconds = 25

        $('.swiper-slide.swiper-slide-prev .pic-counter').html(seconds)
        $('.swiper-slide.swiper-slide-active .pic-counter').html(seconds)

        TimeOutEvent = setInterval(function() {
          seconds -= 1;
          $('.swiper-slide.swiper-slide-active .pic-counter').html(seconds)
          if (seconds == 5) {
            $('.swiper-slide.swiper-slide-active .up-half-wrap-tohide').toggleClass('up-half-wrap-hide')
          }
          if(seconds == 0) {
            clearInterval(TimeOutEvent);
          }
        }, 1000)
      }

      // This needs to be done here
      // CalculateExploreness, can be done asynchronously, no need to wait.
      if(actv == 'app-8') {
        var images = ['#explorerImage0', '#explorerImage1', '#explorerImage2', '#explorerImage3']
        var data = {}

        for(var i in images) {
          data[images[i]] = {}
          $(images[i]+' .sliders').each(function(){
            data[images[i]][$(this).attr('name')] = $(this)[0].noUiSlider.get();
          })
        }

        $.ajax({
          url: '/calculateExplorerness',
          data: JSON.stringify(data),
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
        })
        .done(function( data ) {
          console.log('Explorer data from server', data)
          explorer = data
        }).fail(function (data ) {
          console.log('Fail Explorer data from server', data)
          explorer = data
        });
      }

    })
  }

  ///////////////////
  // Slider events //
  ///////////////////

  // Initialize
  $('.sliders').each(function(index) {
    noUiSlider.create($(this)[0], {
      start: 50,
      connect: "lower",
      direction: 'rtl',
      orientation: "vertical",
      range: {
        'min': 0,
        'max': 100
      },
    });
  });

  // Block and unlock
  $('.sliders').each(function() {

    var blockTarget = $(this).find('.noUi-target')
    var blockOrigin = $(this).find('.noUi-origin')

    var slideID = $(this).attr('picID')
  })

  ///////////////////
  // Slide events  //
  ///////////////////
  $('#up-half-wrap-4').on('click', function() {
    mySwiper.unlockSwipeToNext()
    mySwiper.slideNext(true, 1000)
  })

  $('#bot-half-wrap-4').on('click', function() {
    mySwiper.unlockSwipeToNext()
    mySwiper.slideNext(true, 1000)
  })

  ///////////////////
  // Socket events //
  ///////////////////

  // Subscribe to the server
  socket.on('connect', function onServerSentEvent(msg) {
    console.log('connected')
  })

  // Listen for messages
  socket.on('message', function onServerSentEvent(msg) {

    // Debug
    console.log('Received Interruption with code:', msg['code'])

    // An user logs in
    if(msg['code'] == 'RemoteLoginAction') {
      var slide_href = $('.swiper-slide.swiper-slide-active').attr('href')
      if(slide_href == 'app-3') {
        mySwiper.unlockSwipeToNext()
        mySwiper.slideNext(true, 1000)
      }
    }

    // A song is playing
    if(msg['code'] == 'SongStartPlaying') {
      ('#ReleaseTheBall').html("THE<br>TIMEKEEPER<br>IS BUSY")
      ('#ReleaseTheBall').prop('disabled', true)
    }

    // A song ends to play
    if(msg['code'] == 'SongStopPlaying') {
      ('#ReleaseTheBall').html("CLICK TO<br>RELEASE<br>THE MARBLE")
      ('#ReleaseTheBall').prop('disabled', false)
    }

    if(msg['code'] == 'InvalidUser') {
      reset(mySwiper)
      alert('Unfortunately, you don\'t have enough data for our results to be conclusive, try to listen a little bit more Spotify ;)')
    }

    // A song ends to play
    if(msg['code'] == 'changeSong') {
        $('#Fakeplayer').attr('src','https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+msg['data'] )
        thisSong = msg['data']
    }
  })

  ///////////////////
  // Initialize    //
  ///////////////////
  initialize(mySwiper)
})

///////////////////
// Globals       //
///////////////////
var tkevent = 0
var locks = Array(4).fill(0)

// Socket to communicate with the server
var socket = io.sails.connect();

// Swipper ofr the transitions
var mySwiper = new Swiper ('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,
  effect: 'slide',
  allowSwipeToPrev: false,
  pagination: '.swiper-pagination',
  paginationType: 'progress',
  grabCursor: true,
  followFinger: false,
  // longSwipes: false,
})

$('#tk-data input').on('change paste keyup',function(){
  var enable = 1
  $('#tk-data input').each(function() {
    if(this.value == '')
      enable = 0
  })

  if(enable) {
    $('#SendButton').prop('disabled', false);
    $('#SendButton').css('background-color','rgb(57, 194, 95)')
  } else {
    $('#SendButton').prop('disabled', true);
    $('#SendButton').css('background-color','rgb(75, 75, 75)')
  }
})

$('#SendButton').prop('disabled', true);

$('#LoginButton').prop('disabled', true);
$('#LoginTick').on('click', function() {
  if($(this).is(':checked')) {
    $('#LoginButton').prop('disabled', false);
  } else {
    $('#LoginButton').prop('disabled', true);
  }
})
