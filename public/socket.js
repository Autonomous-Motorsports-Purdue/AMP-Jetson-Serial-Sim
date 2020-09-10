let socket;
socket = io();

$('document').ready(function () {
	$('#connect').click(function () {
		socket.emit('connect');
	});
});
