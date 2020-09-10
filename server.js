/*
    how to:
    start a wsl terminal and follow the below commands:
        ls -l /dev/ttyS5   //note that '5' is the com port num
        sudo chmod o+rw /dev/ttyS5

        --not sure if you need the above--

        to send:
            ehco -ne 'message' > /dev/ttyS5

        to listen:
            cat -v < /dev/ttyS5
*/

const express = require('express');
const app = express();
const server = app.listen(8080);

app.use(express.static('public'));

const socket = require('socket.io');
const io = socket(server);
io.on('connection', function (socket) {
	console.log('new connection:' + socket.id);

	socket.on('serial_connect', function () {
		console.log('test recieved');
		if (port.isOpen) {
			console.log('Port is already open');
		} else {
			port.open(function (err) {
				if (err) {
					return console.log('Error opening port: ', err.message);
				}
			});
		}
	});

	socket.on('serial_disconnect', function () {
		if (port.isOpen) {
			port.close(function (err) {
				if (err) {
					return console.log('Error closing port: ', err.message);
				}
			});
		} else {
			console.log('Port is not open');
		}
	});

	socket.on('serial_send', function (data) {
		console.log(data);
		if (port.isOpen) {
			console.log('sending data');
		} else {
			console.log('Cannot write Serial. Port is not open');
		}
	});
});

const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS6', { autoOpen: false });
