'use strict';
const Gpio = require('pigpio').Gpio;

module.exports = function(pin, type) {
	const gpio = new Gpio(pin, { mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_OFF };

	gpio.trigger(80, 0);

	gpio.enableAlert();
	gpio.disableAlert();

	gpio.on('alert', (level, tick) => {
		//TODO communication logic goes here
		var startTick = 0xffffffff; // 2^32-1 or 4294967295, the max unsigned 32 bit integer
		var endTick = 1;
		console.log((endTick >> 0) - (startTick >> 0)); // prints 2 which is what we want
	});

	function trigger() {
		//Trigger a new relative humidity and temperature reading.
		
		//TODO implement
		/*self.pi.write(self.gpio, pigpio.LOW)
		time.sleep(0.017) // 17 ms
		self.pi.set_mode(self.gpio, pigpio.INPUT)
		self.pi.set_watchdog(self.gpio, 200)*/
	}
};
