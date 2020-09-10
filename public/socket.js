let socket;
socket = io();

$('document').ready(function () {
	$('#connect').click(function () {
		socket.emit('serial_connect');
	});

	$('#disconnect').click(function () {
		socket.emit('serial_disconnect');
	});
});
