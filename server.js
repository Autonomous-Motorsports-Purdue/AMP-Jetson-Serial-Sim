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

server = app.listen(process.env.PORT || 3000);

const socket = require('socket.io');
const io = socket(server);

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});
