var express = require('express'); 

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
console.log('server running')

var socket = require('socket.io');

var io = socket(server);


io.sockets.on('connection', newConnection);
var blobs = [];
function Blob(id, x, y, r){
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = r;
}
function newConnection(socket){
	console.log('new connection: ' + socket.id)
	
	socket.on('mouse', mouseMsg);
	socket.on('agario-start', agarioStart)
	socket.on('agario-update', agarioUpdate)
	socket.on('eaten', eaten)
	socket.on('disconnect', removeBlob)
	function mouseMsg(data){
		socket.broadcast.emit('mouse', data);
		//the line below will send to everyone including the client
		// io.sockets.emit('mouse', data);
		console.log(data)
	}
	function agarioStart(data){
		console.log(socket.id + " " + data.x + " " + data.y + " " +data.r)
		var blob = new Blob(socket.id, data.x, data.y, data.r)
		blobs.push(blob)
		setInterval(heartbeat, 33)

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
		blob.x = data.x;
		blob.y = data.y;
		blob.r = data.r;
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

