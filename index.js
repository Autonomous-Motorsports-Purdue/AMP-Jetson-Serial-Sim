/*
    how to:
    start a wsl terminal and follow the below commands:
        ls -l /dev/ttyS5   //note that '5' is the com port num
        sudo chmod o+rw /dev/ttyS5

        --not sure if you need the above--

        to send:
            echo -ne 'message' > /dev/ttyS5

        to listen:
            cat -v < /dev/ttyS5
*/

const express = require('express');
const app = express();
const server = app.listen(3000);

app.use(express.static('public'));
console.log('My socket server is running');

const socket = require('socket.io');
const io = socket(server);
io.on('connection', newConnection);

function newConnection(socket) {
	console.log('new connection:' + socket.id);

	socket.on('img', imgMsg);

	function imgMsg(data) {
		console.log('recieved: ');
		console.log(data.string);
		// console.log(data.array);
		data.array.forEach((element) => {
			console.log('sending: ' + element);
			port.write(element.toString());
		});
	}
}

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort(
	'/dev/ttyS6',
	function (err) {
		if (err == null) {
			console.log('Connected to Serial Port');
		} else {
			console.log(err);
		}
	},
	{ baudRate: 9600 }
);

const parser = new Readline();
port.pipe(parser);

parser.on('data', (line) => console.log(`> ${line}`));
// > ROBOT ONLINE

// setInterval(() => port.write("test"), 1000);
