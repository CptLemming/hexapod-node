// Servo
var PwmDriver = require('adafruit-i2c-pwm-driver');

var pwm = new PwmDriver(0x40);

console.log('--- Connected ---');

var servoMin = 250;
var servoMax = 600;

pwm.setPWMFreq(60);

var setHigh = function(channel) {
  console.log('setHigh', servoMax);
  pwm.setPWM(channel, 0, servoMax);
};

var setLow = function(channel) {
  console.log('setLow', servoMin);
  pwm.setPWM(channel, 0, servoMin);
};

// Server
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socketio')(server);

io.on('connection', function(socket){
	console.log('Connected');
	socket.emit('login');

	socket.on('setHigh', function(data) {
		console.log('setHigh DATA', data);
		setHigh(data.channel);
	});

	socket.on('setLow', function(data) {
		console.log('setLow DATA', data);
		setLow(data.channel);
	});
});

server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
