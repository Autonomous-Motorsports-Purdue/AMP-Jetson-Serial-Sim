let socket;
socket = io();

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
		$('#serialOut').val('enable');
	});

	$('#control').click(function () {
		$('#serialOut').val('control');
	});
});
