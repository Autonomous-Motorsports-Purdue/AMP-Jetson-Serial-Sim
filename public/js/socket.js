const socket = io();
socket.on('test', function (val) {
	$('textarea#serial_input').val(val);
	// $('#serial_input').append($('<li>').text(val));
	console.log(val);
});
