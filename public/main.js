$(function() {
  var connected = false;
  var socket = io();

  var setHigh = function(channel) {
    if (connected) {
      socket.emit('setHigh', { channel: channel });
    }
  }

  var setLow = function(channel) {
    if (connected) {
      socket.emit('setLow', { channel: channel });
    }
  }

  socket.on('login', function (data) {
    connected = true;
    console.log('Connected');
  });

  $('.servo').each(function() {
    var servoId = $(this).data('id');

    $('.high', this).click(function() {
      console.log('setHigh', servoId);
      setHigh(servoId);
    });

    $('.low', this).click(function() {
      console.log('setLow', servoId);
      setLow(servoId);
    });
  });
});