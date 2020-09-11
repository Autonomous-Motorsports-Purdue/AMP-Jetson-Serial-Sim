let socket;
socket = io();

const serial_start = '02';
const serial_stop = '03';
const serial_id_enable = 'f0';
const serial_enable_str = serial_start + serial_id_enable + serial_stop;

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
