let socket;
socket = io();

const serial_start = '02';
const serial_stop = '03';
const serial_id_enable = 'f0';
const serial_id_control = 'f1';
const serial_id_data_len_1 = 'e1';
const serial_id_data_len_2 = 'e2';
const serial_id_data_len_3 = 'e3';

function serialBuilder() {
	let builder = serial_start;
	let crc = parseInt(serial_start);

	for (let i = 0; i < arguments.length; i++) {
		builder += arguments[i];
		crc += parseInt(arguments[i], 16);
	}

	builder += numToHexStr(crc);
	builder += serial_stop;

	return builder;
}

const serial_enable_str = serialBuilder(serial_id_enable);

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
	$('#connect').click(function () {
		socket.emit('serial_connect');
	});

	$('#disconnect').click(function () {
		socket.emit('serial_disconnect');
	});

	$('#send').click(function () {
		socket.emit('serial_send', $('#serialOut').val());
	});

	$('#enable').click(function () {
		$('#serialOut').val(serial_enable_str);
	});

	$('#control').click(function () {
		const control = serialBuilder(
			serial_id_control,
			serial_id_data_len_3,
			numToHexStr(parseInt($('#brake').val())),
			numToHexStr(parseInt($('#throttle').val())),
			numToHexStr(parseInt($('#steering').val()))
		);
		$('#serialOut').val(control);
	});

	$('#clear').click(function () {
		$('#serialIn').val('');
	});
});

socket.on('serial_recieve', function (data) {
	$('#serialIn').val($('#serialIn').val() + data);
});

socket.on('serialIn_linebreak', function () {
	$('#serialIn').val($('#serialIn').val() + '\n');
});

socket.on('serial_connect_success', function (msg) {
	$('#terminal').val($('#terminal').val() + msg + '\n');
});

socket.on('serial_connect_error', function (msg) {
	$('#terminal').val($('#terminal').val() + msg + '\n');
});

socket.on('serial_disconnect_error', function (msg) {
	$('#terminal').val($('#terminal').val() + msg + '\n');
});

socket.on('serial_disconnect_success', function (msg) {
	$('#terminal').val($('#terminal').val() + msg + '\n');
});
