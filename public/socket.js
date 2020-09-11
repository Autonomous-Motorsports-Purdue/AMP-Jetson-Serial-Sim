let socket;
socket = io();

const serial_start = '02';
const serial_stop = '03';
const serial_id_enable = 'f0';

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
		$('#serialOut').val('control');
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
