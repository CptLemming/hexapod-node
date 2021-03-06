$(function() {
  var connected = false;
  var socket = io();

  var setHigh = function(side, leg, joint, value) {
    if (connected) {
      socket.emit('setHigh', { side: side, leg: leg, joint: joint, value: value });
    }
  };

  var setLow = function(side, leg, joint, value) {
    if (connected) {
      socket.emit('setLow', { side: side, leg: leg, joint: joint, value: value });
    }
  };

  var standUp = function() {
    if (connected) {
      socket.emit('standUp');
    }
  };

  var sitDown = function() {
    if (connected) {
      socket.emit('sitDown');
    }
  };

  var walk = function(stage) {
    if (connected) {
      socket.emit('walk', { stage: stage });
    }
  };

  socket.on('login', function(data) {
    connected = true;
    console.log('Connected', data);
    
    socket.on('video-stream', function(data) {
      $('#video-stream').attr('src', data.imgSrc);
    });

    $('#stand').on('click', function() {
      standUp();
    });

    $('#sit').on('click', function() {
      sitDown();
    });

    $('.walk').on('click', function() {
      var stage = $(this).data('stage');
      walk(stage);
    });

    $('.control-gui tbody tr').each(function() {
      var side = $(this).data('side');
      var leg = $(this).data('leg');
      var joint = $(this).data('joint');
      var servo = data[side][leg][joint];

      var inputHigh = $('input[name="high"]', this);
      var inputLow = $('input[name="low"]', this);

      inputHigh.val(servo.max);
      inputLow.val(servo.min);

      $('button.high', this).click(function() {
        console.log('setHigh', side, leg, joint);
        setHigh(side, leg, joint, inputHigh.val());
      });

      $('button.low', this).click(function() {
        console.log('setLow', side, leg, joint);
        setLow(side, leg, joint, inputLow.val());
      });
    });
  });
});
