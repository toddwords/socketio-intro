var express = require('express'); 
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));
console.log('server running')
var socket = require('socket.io');
var io = socket(server);
var blobs = []; //for agario

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: ' + socket.id)
	
	socket.on('newMsg', newMsg);
	function newMsg(data){
		socket.broadcast.emit('newMsg', data);
		//the line below will send to everyone including the client
		// io.sockets.emit('mouse', data);
		console.log(data)
	}
	socket.on('mouse', mouseMsg);
	function mouseMsg(data){
		socket.broadcast.emit('mouse', data);
		//the line below will send to everyone including the client
		// io.sockets.emit('mouse', data);
		console.log(data)
	}
	//for agario
	socket.on('agario-start', agarioStart)
	socket.on('agario-update', agarioUpdate)
	socket.on('eaten', eaten)
	socket.on('disconnect', removeBlob)
	function agarioStart(data){
		console.log(socket.id + " " + data.x + " " + data.y + " " +data.r)
		var blob = new Blob(socket.id, data.x, data.y, data.r)
		blobs.push(blob)
		setInterval(heartbeat, 33)
		function Blob(id, x, y, r){
			this.id = id;
			this.x = x;
			this.y = y;
			this.r = r;
		}
		function heartbeat(){
			io.sockets.emit('heartbeat', blobs)
		}
	}
	function agarioUpdate(data){
		// console.log(socket.id + " " + data.x + " " + data.y + " " + data.r)
		var blob;
		for (var i = 0; i < blobs.length; i++) {
			if(socket.id == blobs[i].id){
				blob = blobs[i];
				break;
			}
		}
		if(blob){
			blob.x = data.x;
			blob.y = data.y;
			blob.r = data.r;
		}
		
	}
	function eaten(data){
		socket.broadcast.to(data.id).emit('eaten', true)
	}
	function removeBlob(){
		for (var i = 0; i < blobs.length; i++) {
			if(socket.id == blobs[i].id){
				blobs.splice(i, 1)
				console.log('disconnected')
				break
			}
		}
	}
}

 // sending to sender-client only
 // socket.emit('message', "this is a test");

 // sending to all clients, include sender
 // io.emit('message', "this is a test");

 // sending to all clients except sender
 // socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 // socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 // io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 // socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 // io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 // socket.broadcast.to(socketid).emit('message', 'for your eyes only');