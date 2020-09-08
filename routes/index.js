const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('index');
});

router.post('/sendPress', (req, res) => {
	console.log(req.body.serial_CMD_String);
	port.write(req.body.serial_CMD_String);
	res.render('index');
});

router.post('/controlPress', (req, res) => {
	console.log(req.body);
});

module.exports = router;
