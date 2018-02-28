# pigpio-dht

Dht sensor control using node.js and pigpio. Supported sensors are DHT11, DHT22 and AM2302.

## Installation

1. Install [pigpio C library](https://github.com/joan2937/pigpio).
2. Install module: `npm i pigpio-dht`.

## Usage

```javascript
const dht = require('dht');
const sensor = dht(dataPin, dhtType);
```

| Sensor          | dhtType |
|-----------------|:----------------:|
| DHT11           | 11               |
| DHT22 or AM2302 | 22               |

### Example

```javascript
const dht = require('dht');

const dataPin = 5;
const dhtType = 22; //optional
const sensor = dht(dataPin, dhtType);

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

### Methods
#### `read()`

Start a new reading of the sensor. This can't be called more then once every second for the DHT11 sensor or once every 2 seconds for the DHT22 sensor. 

### Events

#### `start`

Emitted when starting to read a value.

#### `end`

Emitted when the reading stops. This because it was complete, an error occurred or anything else.

#### `result`

- result object containing temperature and humidity

Emitted when the reading was completed successful.

#### `badChecksum`

Emitted when finished reading but the checksum was invalid.

## Built With

* [pigpio](https://github.com/fivdi/pigpio) - Gpio wrapper for nodejs

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/depuits/pigpio-dht/tags).
