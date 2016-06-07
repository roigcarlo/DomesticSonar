function getTyped() {

  var hvt  = homebound < 60 ? 'Homebound' : 'Tastemaker'
  var hvtd = homebound < 60 ? 'you <br> like to listen the same <br> music again and again' : 'you <br> are not afraid to <br> try new musical tastes'

  var evc  = explorer > 50 ? 'Explorer' : 'Conserver'
  var evcd = explorer > 50 ? 'nose, ja direu que ficar' : 'las rosas son rojas y el mar azul'

  return {

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
      strings: ['<span> In order to create a <br> future memory you <br> need to know a bit <br> more about your <br> present self. <br> <br> Today you will be able <br> to discover your own <br> musical habits and <br> personality traits. </span>'],
      contentType: 'html',
      typeSpeed: 20,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
      }
    },

    'app-6':{
      strings: ['<span> Let\'s find now more about <br> your personal traits <br> You will go through the <br> </span> <span class="typed-text spotygreen"> Five Factor Model Test </span> <span> a <br> crazy shit that <br> psychologists uses to <br> better understand human <br> behaviour </span>'],
      contentType: 'html',
      typeSpeed: 20,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
      }
    },

    'app-9':{
      strings: ['<span> In terms of life you are a </span> <br> <span class="typed-text spotygreen"> '+ hvt +' </span> <span> because '+ hvtd +' </span>'],
      contentType: 'html',
      typeSpeed: 20,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
      }
    },

    'app-10':{
      strings: ['<span> Muscially speaking you are </span> <span class="typed-text spotygreen"> '+ evc +' </span> <span> because '+ evcd +' </span>'],
      contentType: 'html',
      typeSpeed: 20,
      showCursor: false,
      showCursor: true,
      startDelay: 1000,
      cursorChar: '_',
      callback: function () {
        mySwiper.unlockSwipeToNext()
      }
    },

  }
}

function initialize(swiper) {
    var prev = $('.swiper-slide.swiper-slide-active').attr('href')
    var actv = $('.swiper-slide.swiper-slide-active').attr('href')
    var next = $('.swiper-slide.swiper-slide-active').attr('href')

    $('#footer').children().hide()

    resetTyped(prev, actv, next)
    initTyped( prev, actv, next)
    lockSlide(prev, actv, next, swiper, [
      'app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad',
      'app-6', 'app-7', 'app-9', 'app-10'
    ])
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
  $(".swiper-slide.swiper-slide-active #message").typed(getTyped()[actv])
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
    lockSlide(prev, actv, next, swiper, [
      'app-1', 'app-2', 'app-3', 'app-4', 'fakeLoad',
      'app-6', 'app-7', 'app-9', 'app-10'
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

    // CalculateHomeboundness, can be done asynchronously, no need to wait.
    if(actv == 'app-4') {
      $.ajax({
        url: '/calculateHomeboundness',
        method: 'POST',
      }).done(function( data ) {
        homebound = data
      });
    }

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
        explorer = data
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

var homebound = 0
var explorer = 0

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
