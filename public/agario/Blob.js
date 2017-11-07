function Blob(x, y, r){
	this.pos = createVector(x, y);
	this.vel = createVector(0,0);
	this.r = r

	this.update = function(){
		var newVel = createVector(mouseX-width/2,mouseY-height/2);
		newVel.setMag(3);
		this.vel.lerp(newVel, 0.2)
		this.pos.add(this.vel);

	}

	this.eats = function(other){
		var d = p5.Vector.dist(this.pos,other.pos);
		if(this.r > other.r && d <= this.r){
			var sum = PI * this.r * this.r + PI * other.r * other.r
			this.r = sqrt(sum / PI)
			// this.r += other.r * 0.2;
			return true
		} else {
			return false
		}
	}
	this.constrain = function(){
		blob.pos.x = constrain(blob.pos.x, -width, width)
		blob.pos.y = constrain(blob.pos.y, -height, height)
	}
	this.show = function(){
		fill(255)
		ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2)
	}
}