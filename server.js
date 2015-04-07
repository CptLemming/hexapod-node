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
			shoulder: {
				channel: 0,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 1,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 2,
				min: 250,
				max: 600
			}
		},
		2: {
			shoulder: {
				channel: 4,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 5,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 6,
				min: 250,
				max: 600
			}
		},
		3: {
			shoulder: {
				channel: 8,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 9,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 10,
				min: 250,
				max: 600
			}
		}
	},
	right: {
		1: {
			shoulder: {
				channel: 0,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 1,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 2,
				min: 250,
				max: 600
			}
		},
		2: {
			shoulder: {
				channel: 4,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 5,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 6,
				min: 250,
				max: 600
			}
		},
		3: {
			shoulder: {
				channel: 8,
				min: 250,
				max: 600
			},
			elbow: {
				channel: 9,
				min: 250,
				max: 600
			},
			wrist: {
				channel: 10,
				min: 250,
				max: 600
			}
		}
	}
};

var setHigh = function(side, leg, joint, value) {
  console.log('setHigh', side, leg, joint);
  var servo;
  if (side == 'left') {
  	servo = control_points.left[leg][joint];
  	leftPwm.setPWM(servo.channel, 0, value || servo.max);
  } else if (side == 'right') {
  	servo = control_points.right[leg][joint];
  	rightPwm.setPWM(servo.channel, 0, value || servo.max);
  }
};

var setLow = function(side, leg, joint, value) {
  console.log('setLow', side, leg, joint);
  var servo;
  if (side == 'left') {
  	servo = control_points.left[leg][joint];
  	leftPwm.setPWM(servo.channel, 0, value || servo.min);
  } else if (side == 'right') {
  	servo = control_points.right[leg][joint];
  	rightPwm.setPWM(servo.channel, 0, value || servo.min);
  }
};

// Server
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
	console.log('Connected');
	socket.emit('login', control_points);

	socket.on('setHigh', function(data) {
		// console.log('setHigh DATA', data);
		setHigh(data.side, data.leg, data.joint, data.value);
	});

	socket.on('setLow', function(data) {
		// console.log('setLow DATA', data);
		setLow(data.side, data.leg, data.joint, data.value);
	});
});

server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
