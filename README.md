# pigpio-dht

Dht22 control using node.js and pigpio.

## Installation

1. Install [pigpio C library](https://github.com/joan2937/pigpio).
2. Install module: `npm i pigpio-dht`.

## Usage

```javascript
const dht = require('dht');

const dataPin = 5;
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
```

### Events

#### start

Emitted when starting to read a value.

#### end

Emitted when the reading stops. This because it was complete, an error occured or anything else.

#### result

- result object containing temperature and humidity
Emitted when the reading was completed successful.

#### badChecksum

Emitted when finished reading but the checksum was invalid.

## Built With

* [pigpio](https://github.com/fivdi/pigpio) - Gpio wrapper for nodejs

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/depuits/pigpio-dht/tags).
