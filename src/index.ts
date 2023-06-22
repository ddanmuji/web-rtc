import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

app.use(morgan('dev'));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
	socket.on('join_room', (roomName, done) => {
		socket.join(roomName);
		done();
		socket.to(roomName).emit('welcome');
	});

	socket.on('offer', (offer, roomName) => {
		socket.to(roomName).emit('offer', offer);
	});
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
