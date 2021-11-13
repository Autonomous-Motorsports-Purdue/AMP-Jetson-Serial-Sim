// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


let update; //control update var

consoleLogOverride();

refreshCallback();

function refreshCallback() {

	console.log("so we're here :)");
	console.log("port should be open: " + port.baudRate + " " + port.usbPortName);

	SerialPort.list().then((ports) => {
		document.getElementById('port-list').innerHTML = `${ports
			// locationID changed from comName
			.map((port) => `<option value=${port.locationId}>${port.locationId}</option>`)
			.join('')}`;
	});

	$('#disconnect').trigger('click');

	updateInterface(true);
}

function updateInterface(isDisabled) {

	console.log("or here?");
	
	$('#send').prop('disabled', isDisabled);
	$('#flush').prop('disabled', isDisabled);
	$('#continuous_control').prop('disabled', isDisabled);
	$('#serialIn').prop('disabled', isDisabled);
	$('#cmdIn').prop('disabled', isDisabled);
	$('#clear').prop('disabled', isDisabled);
}

function serialBuilder() {

	console.log("serial builder");

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

	console("num to hex");
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

function onDataCallback(data) {
	//echo back
	console.log(`> ${data.toString('hex')}`);
	const sIn = $('#serialIn');
	const cmdIn = $('#cmdIn');

	sIn.val(sIn.val() + data.toString('hex'));

	pkt.addbyte(data.toString('hex'));

	cmdIn.val(cmdIn.val() + pkt.getParsedPkt());

	if (serial.stop.equals(data)) {
		sIn.val(sIn.val() + '\n');
		cmdIn.val(cmdIn.val() + '\n');
	}

	sIn.scrollTop(sIn[0].scrollHeight);
	cmdIn.scrollTop(cmdIn[0].scrollHeight);
}

$('#refresh').on('click', function () {
	console.log('refresh ports');
	refreshCallback();
});

$('#connect').on('click', function () {
	console.log('connect requested');
	port = new SerialPort($('#port-list :selected').text(), {
		autoOpen: false,
	});

	parser = port.pipe(new ByteLength({ length: 1 }));

	parser.on('data', onDataCallback);

	if (port.isOpen) {
		console.log('Port is already open');
	} else {
		port.open(function (err) {
			if (err) {
				return console.log(`Error opening port: ${err.message}`);
			} else {
				updateInterface(false);

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
				updateInterface(true);

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
	// console.log(`Requested Send: ${str}`);
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

		let period = $('#control-freq').val();
		period = 1000 / period;

		update = setInterval(continousControl, period);
	} else {
		clearInterval(update);
	}
});

$('#clear').on('click', function () {
	$('#serialIn').val('');
	$('#cmdIn').val('');
});

function consoleLogOverride() {
	const old = console.log;
	const logger = $('#terminal');
	console.log = function (message) {
		old(message);
		if (typeof message == 'object') {
			logger.val(
				logger.val() + JSON && JSON.stringify
					? JSON.stringify(message)
					: message + '\n'
			);
		} else {
			logger.val(logger.val() + message + '\n');
		}
		logger.scrollTop(logger[0].scrollHeight);
	};
}

$('#control-freq').on('input', function () {
	// Print entered value in a div box
});
