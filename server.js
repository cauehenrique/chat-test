const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var messageHistoric = [];

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
	app.render('index.html');
});

io.on('connection', (socket) => {
	console.log(`> New User Connected: ${socket.id}!`);

	socket.emit('pastMessage', messageHistoric);

	socket.on('sendMessage', (data) => {
		messageHistoric.push(data);
		socket.broadcast.emit('newMessage', data);
	});
});

console.log('> Server running on 3000!');
server.listen(process.env.PORT || 3000);
