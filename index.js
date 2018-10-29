'use strict';

const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const eventEmitter = require('events').EventEmitter;

module.exports = function(pin, type) {
	const dht = Object.create(new eventEmitter());
	const gpio = new Gpio(pin, { mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_OFF });

	dht.reading = false;

	var lastHighTick = 0;
	var bits = 0;

	var rhumHigh = 0;
	var rhumLow = 0;
	var tempHigh = 0;
	var tempLow = 0;
	var checksum = 0;

	// default type is dht22
	type = type || 22;

	function startReading() {
		if (dht.reading) {
			// cancel out if we are already reading
			return false;
		}
		dht.emit('start');
		// Trigger a new relative humidity and temperature reading.
		// write low for 18 ms
		gpio.digitalWrite(0);
		// after that let the line go high and start reading
		setTimeout(() => {
			// reset all values
			bits = -2; // initialized at -2 because the first 2 lows are the ack
			rhumHigh = 0;
			rhumLow = 0;
			tempHigh = 0;
			tempLow = 0;
			checksum = 0;

			// Set the pin high, particularly for when this is the second or later reading.
			gpio.digitalWrite(1);
			lastHighTick = pigpio.getTick();

			// start reading input
			gpio.mode(Gpio.INPUT);
			gpio.enableAlert();
		}, 18);

		return true;
	}
	function endReading() {
		dht.reading = false;
		gpio.disableAlert();
		gpio.mode(Gpio.OUTPUT);
		dht.emit('end');
	}

	function interpretDht11() {
		let rhum = rhumHigh;
		let temp = tempHigh;

		return { temperature: temp, humidity: rhum };
	}
	function interpretDht22() {
		let rhum = ((rhumHigh << 8) + rhumLow) * 0.1;

		// check the temperature sign
		let mult = (tempHigh & 128) ? -0.1 : 0.1;
		tempHigh = tempHigh & 127; // strip the sign bit
		let temp = ((tempHigh << 8) + tempLow) * mult;

		return { temperature: temp, humidity: rhum };
	}

	gpio.on('alert', (level, tick) => {
		// Accumulate the 40 data bits.  Format into 5 bytes, humidity high,
		// humidity low, temperature high, temperature low, checksum.

		// bits are only accumulated on the low level
		if (level == 0) {
			let diff = pigpio.tickDiff(lastHighTick, tick);

			// Edge length determines if bit is 1 or 0.
			let val = 0;
			// low bit is between 26 and 28 µs
			// high bit is 70 µs
			// So we check on the value in between to avoid small differences
			if (diff >= 50) {
				val = 1;
				if (diff >= 200) { // Bad bit?
					checksum = 256; // Force bad checksum.
				}
			}

			if (bits < 0) {
				// header bits
				// we don't need to do anything with these
			} else if (bits < 8) {
				// in humidity high byte
				rhumHigh = (rhumHigh << 1) + val;
			} else if (bits < 16) {
				// in humidity low byte
				rhumLow = (rhumLow << 1) + val;
			} else if (bits < 24) {
				// in temp high byte
				tempHigh = (tempHigh << 1) + val;
			} else if (bits < 32) {
				// in temp low byte
				tempLow = (tempLow << 1) + val;
			} else {
				// In checksum byte.
				checksum  = (checksum << 1)  + val;

				if (bits == 39) {
					// 40th bit received.
					endReading();

					let total = rhumHigh + rhumLow + tempHigh + tempLow;

					// Is checksum ok?
					if ((total & 255) == checksum) {
						let res = (type == 11) ? interpretDht11() : interpretDht22();

						dht.emit('result', res);
					} else {
						dht.emit('badChecksum');
					}
				}
			}

			++bits;
		} else if (level == 1) {
			lastHighTick = tick;
		}
	});

	return Object.assign(dht, {
		gpio, 
		read: startReading
	});
};
