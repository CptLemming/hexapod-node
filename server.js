// Servo
var PwmDriver = require('adafruit-i2c-pwm-driver');

var leftPwm = new PwmDriver(0x40);
var rightPwm = new PwmDriver(0x41);

console.log('--- Connected ---');

var servoMin = 250;
var servoMax = 600;

leftPwm.setPWMFreq(60);
rightPwm.setPWMFreq(60);

var control_points = {
	left: {
		1: {
			shoulder: 0,
			elbow: 1,
			wrist: 2
		},
		2: {
			shoulder: 4,
			elbow: 5,
			wrist: 6,
		},
		3: {
			shoulder: 8,
			elbow: 9,
			wrist: 10
		}
	},
	right: {
		1: {
			shoulder: 0,
			elbow: 1,
			wrist: 2
		},
		2: {
			shoulder: 4,
			elbow: 5,
			wrist: 6,
		},
		3: {
			shoulder: 8,
			elbow: 9,
			wrist: 10
		}
	}
};

var setHigh = function(side, leg, joint) {
  console.log('setHigh', side, leg, joint);
  if (side == 'left') {
  	leftPwm.setPWM(control_points.left[leg][joint], 0, servoMax);
  } else if (side == 'right') {
  	rightPwm.setPWM(control_points.right[leg][joint], 0, servoMax);
  }
};

var setLow = function(side, leg, joint) {
  console.log('setLow', side, leg, joint);
  if (side == 'left') {
  	leftPwm.setPWM(control_points.left[leg][joint], 0, servoMin);
  } else if (side == 'right') {
  	rightPwm.setPWM(control_points.right[leg][joint], 0, servoMin);
  }
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
		setHigh(data.side, data.leg, data.joint);
	});

	socket.on('setLow', function(data) {
		console.log('setLow DATA', data);
		setLow(data.data.side, data.leg, data.joint);
	});
});

server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
