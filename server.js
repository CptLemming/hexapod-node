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
				min: 300,
				max: 450
			},
			elbow: {
				channel: 1,
				min: 200,
				max: 350
			},
			wrist: {
				channel: 2,
				min: 400,
				max: 250
			}
		},
		2: {
			shoulder: {
				channel: 4,
				min: 250,
				max: 400
			},
			elbow: {
				channel: 5,
				min: 200,
				max: 350
			},
			wrist: {
				channel: 6,
				min: 400,
				max: 250
			}
		},
		3: {
			shoulder: {
				channel: 8,
				min: 350,
				max: 450
			},
			elbow: {
				channel: 9,
				min: 200,
				max: 350
			},
			wrist: {
				channel: 10,
				min: 350,
				max: 200
			}
		}
	},
	right: {
		1: {
			shoulder: {
				channel: 0,
				min: 400,
				max: 250
			},
			elbow: {
				channel: 1,
				min: 450,
				max: 300
			},
			wrist: {
				channel: 2,
				min: 350,
				max: 500
			}
		},
		2: {
			shoulder: {
				channel: 4,
				min: 400,
				max: 250
			},
			elbow: {
				channel: 5,
				min: 450,
				max: 300
			},
			wrist: {
				channel: 6,
				min: 350,
				max: 500
			}
		},
		3: {
			shoulder: {
				channel: 8,
				min: 450,
				max: 350
			},
			elbow: {
				channel: 9,
				min: 500,
				max: 350
			},
			wrist: {
				channel: 10,
				min: 350,
				max: 500
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

var standUp = function() {
	var elbow, wrist;
	for (var side in control_points) {
		for (var leg in control_points[side]) {
			setLow(side, leg, 'elbow');
			setHigh(side, leg, 'wrist');
		}
	}
};

var sitDown = function() {
	var elbow, wrist;
	for (var side in control_points) {
		for (var leg in control_points[side]) {
			setHigh(side, leg, 'elbow');
			setLow(side, leg, 'wrist');
		}
	}
};

var walkStage1 = function() {
	// L1, L3, R2 up
	setHigh('left', '1', 'elbow');
	setLow('left', '1', 'wrist');

	setHigh('left', '3', 'elbow');
	setLow('left', '3', 'wrist');

	setHigh('right', '2', 'elbow');
	setLow('right', '2', 'wrist');
};

var walkStage2 = function() {
	// L1, L2, L3, R1, R2, R3 forward
	setHigh('left', '1', 'shoulder');
	setHigh('left', '2', 'shoulder');
	setHigh('left', '3', 'shoulder');

	setHigh('right', '1', 'shoulder');
	setHigh('right', '2', 'shoulder');
	setHigh('right', '3', 'shoulder');
};

var walkStage3 = function() {
	// L1, L3, R2 down
	setLow('left', '1', 'elbow');
	setHigh('left', '1', 'wrist');

	setLow('left', '3', 'elbow');
	setHigh('left', '3', 'wrist');

	setLow('right', '2', 'elbow');
	setHigh('right', '2', 'wrist');
};

var walkStage4 = function() {
	// R1, R3, L2 up
	setHigh('right', '1', 'elbow');
	setLow('right', '1', 'wrist');

	setHigh('right', '3', 'elbow');
	setLow('right', '3', 'wrist');

	setHigh('left', '2', 'elbow');
	setLow('left', '2', 'wrist');
};

var walkStage5 = function() {
	// L1, L2, L3, R1, R2, R3 backward
	setLow('left', '1', 'shoulder');
	setLow('left', '2', 'shoulder');
	setLow('left', '3', 'shoulder');

	setLow('right', '1', 'shoulder');
	setLow('right', '2', 'shoulder');
	setLow('right', '3', 'shoulder');
};

var walkStage6 = function() {
	// R1, R3, L2 down
	setLow('right', '1', 'elbow');
	setHigh('right', '1', 'wrist');

	setLow('right', '3', 'elbow');
	setHigh('right', '3', 'wrist');

	setLow('left', '2', 'elbow');
	setHigh('left', '2', 'wrist');
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

	socket.on('standUp', function() {
		standUp();
	});

	socket.on('sitDown', function() {
		sitDown();
	});

	socket.on('walk', function(data) {
		switch (data.stage) {
			case '1':
				walkStage1();
				break;
			case '2':
				walkStage2();
				break;
			case '3':
				walkStage3();
				break;
			case '4':
				walkStage4();
				break;
			case '5':
				walkStage5();
				break;
			case '6':
				walkStage6();
				break;
		}
	});
});

server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
