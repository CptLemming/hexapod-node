console.log('----------------');
console.log('--- Starting ---');
console.log('----------------');

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

setLow(1);
// setLow(0);
// setHigh(1);
// setLow(2);

setTimeout(function() {
  setHigh(1);
  // setHigh(0);
  // setLow(1);
  // setHigh(2);
}, 5000);

setTimeout(function() {
  setLow(1);
  // setLow(0);
  // setHigh(1);
  // setLow(2);
}, 10000);

process.on('SIGINT', function() {
  console.log("\nGraceful shutdown");
  pwm.stop();
  return process.exit();
});

