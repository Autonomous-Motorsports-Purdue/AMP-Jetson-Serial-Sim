const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

function Serial() {
	this.isConnected;
	this.portname = '/dev/ttyS6';
	this.baudRate = 9600;
	this.parser;
	this.port;

	this.serialResponse = '';

	this.write = function (str) {
		console.log(this.isConnected);
		if (this.isConnected) {
			this.port.write(str);
		} else {
			console.log("tried to write to port that isn't connected");
		}
	};

	this.disconnect = function () {
		console.log('no functionality currently');
	};

	this.connect = async function () {
		this.port = new SerialPort(
			this.portname,
			function (err) {
				if (err == null) {
					console.log('Connected to Serial Port');
					this.isConnected = true;
					console.log('here');
				} else {
					console.log(err);
					this.isConnected = false;
				}
			},
			{ baudRate: this.baudRate }
		);

		this.parser = new Readline();
		this.port.pipe(this.parser);

		this.serialResponse = '>';

		this.parser.on('data', (line) => (this.serialResponse += `> ${line}`));
	};
}

module.exports = Serial;

/** unused code */

// const server = app.listen(process.env.PORT || 3000);

// const socket = require('socket.io');
// const io = socket(server);
// io.on('connection', newConnection);

// function newConnection(socket) {
// 	console.log('new connection:' + socket.id);

// 	socket.on('img', imgMsg);

// 	function imgMsg(data) {
// 		console.log('recieved: ');
// 		console.log(data.string);
// 		// console.log(data.array);
// 		data.array.forEach((element) => {
// 			console.log('sending: ' + element);
// 			port.write(element.toString());
// 		});
// 	}
// }
