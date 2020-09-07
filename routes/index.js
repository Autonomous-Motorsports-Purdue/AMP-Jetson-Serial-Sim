const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('index');
});

router.post('/sendPress', (req, res) => {
	console.log(req.body);
});

router.post('/controlPress', (req, res) => {
	console.log(req.body);
});

module.exports = router;
