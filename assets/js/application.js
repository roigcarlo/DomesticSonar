function initialize(swiper) {
    var prev = $('.swiper-slide.swiper-slide-active').attr('href')
    var actv = $('.swiper-slide.swiper-slide-active').attr('href')
    var next = $('.swiper-slide.swiper-slide-active').attr('href')

    $('#footer').children().hide()

    resetTyped(prev, actv, next)
    initTyped( prev, actv, next)
    lockSlide(prev, actv, next, swiper, ['app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad', 'app-7'])
}

function resetTyped(prev, actv, next) {
  $(".swiper-slide.swiper-slide-next #message").typed('reset')
}

function resetWheel(prev, actv, next, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {
    $('.loading-disk').html(0)
  }
}

function initTyped(prev, actv, next) {
  $(".swiper-slide.swiper-slide-active #message").typed(typetexts[actv])
}

function initWheel(prev, actv, next, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {
    var progress = 0
    var interval = setInterval(function() {
      progress += 1;
      $('.loading-disk').html(progress)
      if (progress >= 100) {
        clearInterval(interval);
        $('.loading-disk').html(progress)
        swiper.unlockSwipeToNext()
        swiper.slideNext(true, 1000)
        setTimeout(function () {
          $('.loading-disk').html(progress)
        }, 10)
      }
    }, 50)
  }
}

function lockSlide(prev, actv, next, swiper, onSlide) {
  if(onSlide.indexOf(actv) >= 0) {
    swiper.lockSwipeToNext()
  }
}

$(document).ready(function () {

  ///////////////////
  // Swiper events //
  ///////////////////
  mySwiper.on('onSlideChangeStart', function (swiper) {
    var prev = $('.swiper-slide.swiper-slide-active').attr('href')
    var actv = $('.swiper-slide.swiper-slide-active').attr('href')
    var next = $('.swiper-slide.swiper-slide-active').attr('href')

    resetTyped(prev, actv, next, swiper);
    resetWheel(prev, actv, next, swiper, ['app-3', 'app-7']);
  })

  mySwiper.on('onSlideChangeEnd', function (swiper) {
    var prev = $('.swiper-slide.swiper-slide-active').attr('href')
    var actv = $('.swiper-slide.swiper-slide-active').attr('href')
    var next = $('.swiper-slide.swiper-slide-active').attr('href')

    initTyped(prev, actv, next, swiper);
    initWheel(prev, actv, next, swiper, ['fakeLoad'])
    lockSlide(prev, actv, next, swiper, ['app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad', 'app-7'])

    // Send info
    if(actv == 'app-3') {
      $.ajax({
        url: '/createNewSession',
        method: 'POST',
      })
      .done(function( data ) {
        $('#sessionCode').html(data)
      });
    }
  })

  ///////////////////
  // Slider events //
  ///////////////////

  // Initialize
  $('.sliders').each(function(index) {
    noUiSlider.create($(this)[0], {
      start: 0,
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

    $(this)[0].noUiSlider.on('set', function(index) {
      // Change color of the slider
      blockTarget.attr('disabled',true)
      blockOrigin.attr('disabled',true)

      locks[slideID] += 1
      console.log(slideID, locks[slideID])

      if(locks[slideID] == 4) {
        setTimeout(function () {
          mySwiper.unlockSwipeToNext()
          mySwiper.slideNext(true, 1000)
        }, 750);
      }
    })
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
})

///////////////////
// Typed Texts   //
///////////////////
var typetexts = {

  'app-1': {
    strings: ['<span class="typed-text spotygreen">Hello </span> <span id="typed-name">Peppa</span>  <br> <span class="typed-text">Your are about to <br> create a future <br> memory and become <br> part of a scientific <br> resarch on human <br> behaviours.</span>'],
    contentType: 'html',
    typeSpeed: 20,
    showCursor: false,
    callback: function () {
      $("#typed-name").typed({
        strings: ['Obama', 'Charlio', 'Juan de las nieves', 'Daenerys Targaryen', 'Darkness my old friend'],
        contentType: 'html',
        typeSpeed: 20,
        loop: true,
        showCursor: true,
        cursorChar: '_'
      });

      mySwiper.unlockSwipeToNext()
      console.log($('#footer-1-content'))
      $('#footer-1-content').show()
    }
  },

  'app-2':{
    strings: ['<span id="message2">In order to create a <br> future memory you <br> need to know a bit <br> more about your <br> present self. <br> <br> Today you will be able <br> to discover your own <br> musical habits and <br> personality traits.</span>'],
    contentType: 'html',
    typeSpeed: 20,
    showCursor: false,
    showCursor: true,
    startDelay: 1000,
    cursorChar: '_',
    callback: function () {
      mySwiper.unlockSwipeToNext()
    }
  }

}
