/*
    how to:
    start a wsl terminal and follow the below commands:
        ls -l /dev/ttyS5   //note that '5' is the com port num
        sudo chmod o+rw /dev/ttyS5

        --not sure if you need the above--

        to send:
            echo -ne 'message' > /dev/ttyS5

        to listen:
            cat -v < /dev/ttyS5
*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// routers
const indexRouter = require('./routes/index');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));

app.use('/', indexRouter);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort(
	'/dev/ttyS6',
	function (err) {
		if (err == null) {
			console.log('Connected to Serial Port');
		} else {
			console.log(err);
		}
	},
	{ baudRate: 9600 }
);

const parser = new Readline();
port.pipe(parser);

parser.on('data', (line) => console.log(`> ${line}`)); // > ROBOT ONLINE

app.listen(process.env.PORT || 3000);

/** unused code */

// const server = app.listen(process.env.PORT || 3000);

// const socket = require('socket.io');
// const io = socket(server);
// io.on('connection', newConnection);

// function newConnection(socket) {
// 	console.log('new connection:' + socket.id);

// 	socket.on('img', imgMsg);

// 	function imgMsg(data) {
// 		console.log('recieved: ');
// 		console.log(data.string);
// 		// console.log(data.array);
// 		data.array.forEach((element) => {
// 			console.log('sending: ' + element);
// 			port.write(element.toString());
// 		});
// 	}
// }
