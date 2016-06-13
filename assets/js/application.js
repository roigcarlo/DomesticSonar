const TEXT_SPEED = -20

var homebound = 0
var explorer = 0
var userShare = 0

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
    ? '<span> Hey there </span> <span class="typed-text spotygreen"> Homebound! </span> <br> <span> Seems like you\'ve got your <br> music taste pretty clear, <br> you like to listen to the same <br> kind of music all the time, <br> staying in a tune comfort zone. <br> Play on repeat! </span>'
    : '<span> Hey there </span> <span class="typed-text spotygreen"> Tastemaker! </span> <br> Seems like you like <br> exploring new tunes,  <br> constantly in search <br> of new musical <br> expriences. <br> Shuffle mode on! </span>'

  var names = [
    'Jordi', 'Sam', 'Carles', 'Frank', 'Dani', 'Pau', 'Iolanda', 'Chus', 'Lotte', 'Sharon', 'Edgar', 'Alex', 'Pol', 'Oscar', 'Mariona', 'Alexandra', 'Axel', 'Charlie',
    'Joan', 'Rouse', 'Jackie chan', 'Drake', 'Harry potter', 'Han solo', 'Chewaka', 'Marty McFly', 'Mark'
  ]

  return {
    'app-1': {
      strings: ['<span class="typed-text spotygreen">Hello </span> <span id="typed-name">Mark</span>  <br> <span class="typed-text">You are about to <br> create a future <br> moment while becoming part of a collective <br> scientific experiment on <br> human behaviors.</span>'],
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
      strings: ['<span> In order to be able to <br> curate a perfect song for <br> your future moment first <br> we need to know a bit <br> more about you. <br> <br> Ready to reveal your <br> musical habits and <br> personality traits? <br> Here we go!  </span>'],
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
      strings: ['<span> Time for the <br> </span> <span class="typed-text spotygreen"> Five Factor Model Test </span> <span> <br> a crazy test that <br> psychologists use to <br> understand humman <br> behavior. </span>'],
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
      'app-6', 'app-7', 'app-9', 'app-10'
    ])
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

function initWheel(prev, actv, next, swiper, onSlide, drawProgress) {
  if(onSlide.indexOf(actv) >= 0) {

    var $pCaption = $('.progress-wheel p');
    var iProgress = $('.inactiveProgress');
    var aProgress = $('.activeProgress');

    var progress = 0

    aProgress.each(function() {
      drawProgress(this, 0, $pCaption);
    })

    var progress = 0
    var interval = setInterval(function() {
      progress += 0.80;
      aProgress.each(function() {
        drawProgress(this, progress/100, $pCaption);
      })
      if (progress >= 100) {
        clearInterval(interval);
        aProgress.each(function() {
          drawProgress(this, 100/100, $pCaption);
        })
        setTimeout(function () {
          swiper.unlockSwipeToNext()
          swiper.slideNext(true, 1000)
        }, 100)
      }
    }, 7.5)
  }
}

function lockSlide(prev, actv, next, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {
    swiper.lockSwipeToNext()
  }
}

function SendFormTK() {
  var data = {}

  $('#tk-data input').each(function() {
    data[this.id] = this.value
  })

  console.log(data)

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
    mySwiper.on('onSlideChangeStart', function (swiper) {
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

    mySwiper.on('onSlideChangeEnd', function (swiper) {
      var prev = $('.swiper-slide.swiper-slide-prev').attr('href')
      var actv = $('.swiper-slide.swiper-slide-active').attr('href')
      var next = $('.swiper-slide.swiper-slide-next').attr('href')

      initTyped(prev, actv, next, swiper);
      initWheel(prev, actv, next, swiper, ['fakeLoad'], drawProgress)
      lockSlide(prev, actv, next, swiper, [
        'app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad',
        'app-6', 'app-9', 'app-10'
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
        var seconds = 30

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

    // $(this)[0].noUiSlider.on('set', function(index) {
    //   // Change color of the slider
    //   // blockTarget.attr('disabled',true)
    //   // blockOrigin.attr('disabled',true)
    //
    //   locks[slideID] += 1
    //   console.log(slideID, locks[slideID])
    //
    //   if(locks[slideID] == 4) {
    //     setTimeout(function () {
    //       clearInterval(TimeOutEvent);
    //       // mySwiper.unlockSwipeToNext()
    //       // mySwiper.slideNext(true, 1000)
    //     }, 2000);
    //   }
    // })
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
      playingTrack = true
    }

    // A song ends to play
    if(msg['code'] == 'SongStopPlaying') {
      playingTrack = false
    }

    // A song ends to play
    if(msg['code'] == 'changeSong') {
        $('#Fakeplayer').attr('src','https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+msg['data'] )
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
var playingTrack = 0
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
  grabCursor: true
  // longSwipes: false,
})
