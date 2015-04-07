$(function() {
  var connected = false;
  var socket = io();

  var setHigh = function(side, leg, joint) {
    if (connected) {
      socket.emit('setHigh', { side: side, leg: leg, joint: joint });
    }
  };

  var setLow = function(side, leg, joint) {
    if (connected) {
      socket.emit('setLow', { side: side, leg: leg, joint: joint });
    }
  };

  socket.on('login', function (data) {
    connected = true;
    console.log('Connected');
  });

  $('.control-gui tr').each(function() {
    var side = $(this).data('side');
    var leg = $(this).data('leg');
    var joint = $(this).data('joint');

    $('.high', this).click(function() {
      console.log('setHigh', side, leg, joint);
      setHigh(side, leg, joint);
    });

    $('.low', this).click(function() {
      console.log('setLow', side, leg, joint);
      setLow(side, leg, joint);
    });
  });
});