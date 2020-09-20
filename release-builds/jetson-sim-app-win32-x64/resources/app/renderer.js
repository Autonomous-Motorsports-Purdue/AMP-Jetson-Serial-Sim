// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const SerialPort = require('serialport');
// const port = new SerialPort('/dev/ttyS6');

const SerialPort = require('serialport');
const port = new SerialPort('COM6', { autoOpen: false });
const ByteLength = require('@serialport/parser-byte-length');
const parser = port.pipe(new ByteLength({ length: 1 }));
const serial = require('./serial.js');

const $ = require('jQuery');

const SerialPkt = require('./serialpkt');
const pkt = new SerialPkt.SerialPkt();

let update; //control update var

function serialBuilder() {
	let builder = SerialPkt.serial_start;
	let crc = parseInt(SerialPkt.serial_start);

	for (let i = 0; i < arguments.length; i++) {
		builder += arguments[i];
		crc += parseInt(arguments[i], 16);
	}

	builder += numToHexStr(crc);
	builder += SerialPkt.serial_stop;

	return builder;
}

const serial_enable_str = serialBuilder(SerialPkt.serial_id_enable);

function numToHexStr(num) {
	let hex = num.toString(16);

	if (hex.length > 2) {
		let len = hex.length;

		hex = hex.substring(len - 2, len);
	} else {
		while (hex.length < 2) {
			hex = '0' + hex;
		}
	}

	if (hex.length % 2) {
		console.error('Something went wrong with str2Hex');
	}

	return hex;
}

function numToHexStr(num) {
	let hex = num.toString(16);

	if (hex.length > 2) {
		let len = hex.length;

		hex = hex.substring(len - 2, len);
	} else {
		while (hex.length < 2) {
			hex = '0' + hex;
		}
	}

	if (hex.length % 2) {
		console.error('Something went wrong with str2Hex');
	}

	return hex;
}

$('document').ready(function () {
	$('#send').prop('disabled', true);
	$('#flush').prop('disabled', true);
	$('#continuous_control').prop('disabled', true);
	$('#serialIn').prop('disabled', true);
	$('#cmdIn').prop('disabled', true);
	$('#clear').prop('disabled', true);
});

parser.on('data', function (data) {
	//echo back
	// console.log(`> ${data.toString('hex')}`);

	$('#serialIn').val($('#serialIn').val() + data.toString('hex'));

	pkt.addbyte(data.toString('hex'));

	$('#cmdIn').val($('#cmdIn').val() + pkt.getParsedPkt());

	if (serial.stop.equals(data)) {
		console.log('stop');
		// socket.emit('serialIn_linebreak');
	}

	$('#serialIn').scrollTop($('#serialIn')[0].scrollHeight);
	$('#cmdIn').scrollTop($('#cmdIn')[0].scrollHeight);
});

$('#connect').on('click', function () {
	if (port.isOpen) {
		console.log('Port is already open');
	} else {
		port.open(function (err) {
			if (err) {
				return console.log(`Error opening port: ${err.message}`);
			} else {
				$('#send').prop('disabled', false);
				$('#flush').prop('disabled', false);
				$('#serialIn').prop('disabled', false);
				$('#cmdIn').prop('disabled', false);
				$('#clear').prop('disabled', false);
				$('#continuous_control').prop('disabled', false);
				return console.log('port opened');
			}
		});
	}
});

$('#disconnect').on('click', function () {
	if (port.isOpen) {
		port.close(function (err) {
			if (err) {
				return console.log(`Error closing port: ${err.message}`);
			} else {
				$('#send').prop('disabled', true);
				$('#flush').prop('disabled', true);
				$('#continuous_control').prop('disabled', true);
				$('#serialIn').prop('disabled', true);
				$('#cmdIn').prop('disabled', true);
				$('#clear').prop('disabled', true);
				console.log('Port Disconected');
			}
		});
	} else {
		console.log('port is already closed');
	}
});

$('#send').on('click', function () {
	const str = $('#serialOut').val();
	if (str == '') {
		return;
	}
	console.log(`Requested Send: ${str}`);
	if (port.isOpen) {
		port.write(Buffer.from(str, 'hex'));
	} else {
		console.log('Cannot write Serial. Port is not open');
	}
});

$('#flush').on('click', function () {
	if (port.isOpen) {
		alert('flush is not implemented!');
		// port.flush(function (err) {
		// 	if (err) {
		// 		console.log('Error Flushing the Serial');
		// 	} else {
		// 		console.log('serial flushed');
		// 	}
		// });
	} else {
		console.log('port is not open');
	}
});

$('#enable').on('click', function () {
	$('#serialOut').val(serial_enable_str);
});

$('#control').on('click', function () {
	let control = 'default';

	const data_len = $('#data_length').val();

	const steering = numToHexStr(parseInt($('#steering').val()));

	if (data_len == 1) {
		control = serialBuilder(serial_id_control, serial_id_data_len_1, steering);
	}

	const throttle = numToHexStr(parseInt($('#throttle').val()));

	if (data_len == 2) {
		control = serialBuilder(
			SerialPkt.serial_id_control,
			SerialPkt.serial_id_data_len_2,
			throttle,
			steering
		);
	}

	const brake = numToHexStr(parseInt($('#brake').val()));

	if (data_len == 3) {
		control = serialBuilder(
			SerialPkt.serial_id_control,
			SerialPkt.serial_id_data_len_3,
			brake,
			throttle,
			steering
		);
	}

	$('#serialOut').val(control);
});

function continousControl() {
	$('#control').trigger('click');
	$('#send').trigger('click');
}

$('#continuous_control').on('click', function () {
	if ($(this).prop('checked')) {
		continousControl();
		update = setInterval(continousControl, 500);
	} else {
		clearInterval(update);
	}
});

$('#clear').on('click', function () {
	$('#serialIn').val('');
	$('#cmdIn').val('');
});
