'use strict';
const dht = require('../');

const dataPin = 2;
const sensor = dht(dataPin);

setInterval(() => { 
	sensor.read();
}, 2500); // the sensor can only be red every 2 seconds

sensor.on('result', data => {
	console.log(`temp: ${data.temperature}°c`); 
	console.log(`rhum: ${data.humidity}%`); 
});

sensor.on('badChecksum', () => {
	console.log('checksum failed');
});
