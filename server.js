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

const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS6', { autoOpen: false });
const ByteLength = require('@serialport/parser-byte-length');
const parser = port.pipe(new ByteLength({ length: 1 }));
const serial = require('./serial.js');

app.use(express.static('public'));

const socket = require('socket.io');
const io = socket(server);

io.on('connection', function (socket) {
	console.log('new connection:' + socket.id);

	parser.on('data', function (data) {
		//echo back
		console.log(`> ${data.toString('hex')}`);

		socket.emit('serial_recieve', data.toString('hex'));

		if (serial.stop.equals(data)) {
			console.log('stop');
			socket.emit('serialIn_linebreak');
		}
	});

	parser.on('error', function (err) {
		socket.emit('serial_error', `Serial Error: ${err.message}`);
		console.log(`Serial Error: ${err.message}`);
	});

	socket.on('serial_connect', function () {
		if (port.isOpen) {
			console.log('Port is already open');
			socket.emit('serial_connect_error', 'Port is already open');
		} else {
			port.open(function (err) {
				if (err) {
					socket.emit(
						'serial_connect_error',
						`Error opening port: ${err.message}`
					);
					return console.log(`Error opening port: ${err.message}`);
				} else {
					socket.emit('serial_connect_success', 'port opened');
					return console.log('port opened');
				}
			});
		}
	});

	socket.on('serial_disconnect', function () {
		if (port.isOpen) {
			port.close(function (err) {
				if (err) {
					socket.emit(
						'serial_disconnect_error',
						`Error closing port: ${err.message}`
					);
					return console.log(`Error closing port: ${err.message}`);
				} else {
					socket.emit('serial_disconnect_success', 'port disconnected');
					console.log('port disconnected');
				}
			});
		} else {
			socket.emit('serial_disconnect_error', 'Port is not open');
			console.log('Port is not open');
		}
	});

	socket.on('serial_send', function (str) {
		console.log(`Requested Send: ${str}`);
		if (port.isOpen) {
			port.write(Buffer.from(str, 'hex'));
		} else {
			console.log('Cannot write Serial. Port is not open');
		}
	});

	socket.on('serial_flush', function () {
		if (port.isOpen) {
			port.flush(function (err) {
				if (err) {
					console.log('Error Flushing the Serial');
				} else {
					console.log('serial flushed');
				}
			});
		} else {
			console.log('port is not open');
		}
	});
});
