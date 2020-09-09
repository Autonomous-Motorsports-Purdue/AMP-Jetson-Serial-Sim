$(function () {
	var socket = io();

	socket.on('serialInUpdate', function (msg) {
		$('#messages').append($('<li>').text(msg));
	});
});
