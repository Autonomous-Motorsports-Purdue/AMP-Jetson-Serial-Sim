const express = require('express');
const router = express.Router();
// const ser = require('../models/serial.js');
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS6', { autoOpen: false });

// const serial = new ser();

router.get('/', async (req, res) => {
	res.render('index');
});

router.post('/connect', async (req, res) => {
	port.open(function (err) {
		if (err) {
			console.log('Error Opening Port: ', err.message);
			res.redirect('/');
		}
	});
	port.on('data', function (data) {
		console.log(`> ${data}`);
	});
	res.redirect('/');
});

router.post('/disconnect', (req, res) => {
	serial.disconnect();
	res.redirect('/');
});

router.post('/sendPress', (req, res) => {
	if (port) console.log(req.body.serial_CMD_String);
	serial.write(req.body.serial_CMD_String);
	res.redirect('/');
});

router.post('/controlPress', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
