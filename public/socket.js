let socket;
socket = io();

let update; //control update var

const pkt = new SerialPkt();

const kart_idle_ack = 'a0';
const kart_enable_ack = 'a1';
const kart_error_ack = 'a2';
const kart_ctrl_ack = 'a3';

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
		const out = $('#serialOut').val();
		if (out == '') {
			return;
		}
		socket.emit('serial_send', out);
	});

	$('#flush').click(function () {
		socket.emit('serial_flush');
	});

	$('#enable').click(function () {
		$('#serialOut').val(serial_enable_str);
	});

	$('#control').click(function () {
		let control = 'default';

		const data_len = $('#data_length').val();

		const steering = numToHexStr(parseInt($('#steering').val()));

		if (data_len == 1) {
			control = serialBuilder(
				serial_id_control,
				serial_id_data_len_1,
				steering
			);
		}

		const throttle = numToHexStr(parseInt($('#throttle').val()));

		if (data_len == 2) {
			control = serialBuilder(
				serial_id_control,
				serial_id_data_len_2,
				throttle,
				steering
			);
		}

		const brake = numToHexStr(parseInt($('#brake').val()));

		if (data_len == 3) {
			control = serialBuilder(
				serial_id_control,
				serial_id_data_len_3,
				brake,
				throttle,
				steering
			);
		}

		$('#serialOut').val(control);
	});

	$('#continuous_control').click(function () {
		if ($(this).prop('checked')) {
			continousControl();
			update = setInterval(continousControl, 500);
		} else {
			clearInterval(update);
		}
	});

	$('#clear').click(function () {
		$('#serialIn').val('');
	});
});

socket.on('serial_recieve', function (data) {
	$('#serialIn').val($('#serialIn').val() + data);

	pkt.addbyte(data);

	$('#cmdIn').val($('#cmdIn').val() + pkt.getParsedPkt());
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

function data_length_callback(val) {
	const data_length_label = document.getElementById('data_length_label');
	data_length_label.innerHTML = val;

	const brake = document.getElementById('brake');
	const throttle = document.getElementById('throttle');

	if (val <= 2) {
		brake.disabled = true;
	} else {
		brake.disabled = false;
	}

	if (val <= 1) {
		throttle.disabled = true;
	} else {
		throttle.disabled = false;
	}
}

function continousControl() {
	$('#control').click();
	$('#send').click();
}
