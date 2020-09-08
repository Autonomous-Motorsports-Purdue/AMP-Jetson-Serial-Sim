const express = require('express');
const router = express.Router();
// const ser = require('../models/serial.js');
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS6', { autoOpen: false });

port.on('open', function () {
	console.log('port is opened');
});

port.on('data', function (data) {
	console.log(`> ${data}`);
});

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

	res.redirect('/');
});

router.post('/disconnect', (req, res) => {
	console.log('no current functionality');
	res.redirect('/');
});

router.post('/sendPress', (req, res) => {
	if (port.isOpen) {
		console.log(req.body.serial_CMD_String);
		port.write(req.body.serial_CMD_String);
	} else {
		console.log('port is not open');
	}
	res.redirect('/');
});

router.post('/controlPress', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
