var blob;
var lilBlobs = [];
var blobs = [];
var zoom = 1;
var socket;
function setup(){
	socket = io()
	createCanvas(600,600);
	blob = new Blob(random(width), random(height), random(8,24));

	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r
	};
	socket.emit('agario-start', data)
	socket.on('heartbeat', function(data){
		blobs=data
	})
	socket.on('eaten', function(data){
		blob = new Blob(random(width), random(height), random(8,24));
	})
	for (var i = 0; i < 50; i++) {
		var x = random(-width, width)
		var y = random(-height, height)
		lilBlobs[i] = new Blob(x, y, 6);
	}
}

function draw(){
	background(0);
	//translate(width/2-blob.pos.x, height/2-blob.pos.y)
	translate(width/2, height/2)
	var newzoom = 64 / blob.r;
	zoom = lerp(zoom, newzoom, 0.1)
	scale(zoom)
	translate(-blob.pos.x, -blob.pos.y)
	blob.update();
	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r
	};
	socket.emit('agario-update', data)
	blob.constrain();
	blob.show();
	if(socket.id){
		textAlign(CENTER);
		textSize(blob.r * 0.6);
		text(socket.id.slice(-5), blob.pos.x, blob.pos.y + blob.r * 2 + 10)
	}
	for (var i = blobs.length-1; i >= 0; i--) {
		console.log(blobs[i].id + " " + socket.id)
		if(blobs[i].id == socket.id){continue;}

		fill(random(100), random(100), random(100,255))
		var otherBlob = new Blob(blobs[i].x, blobs[i].y, blobs[i].r)
		otherBlob.show()
		fill(255)
		textSize(blobs[i].r * 0.6);
		text(blobs[i].id.slice(-5), blobs[i].x, blobs[i].y + blobs[i].r * 2 + 10)
		if(blob.eats(otherBlob)){
			var data = {id: blobs[i].id}
			socket.emit('eaten', data);
			blobs[i].r = 0;
		}
	}
	for (var i = 0; i < lilBlobs.length; i++) {
		lilBlobs[i].show()
		if(blob.eats(lilBlobs[i])){
			var x = random(-width, width)
			var y = random(-height, height)
			lilBlobs[i] = new Blob(x, y, 6);
		}
	}
}

