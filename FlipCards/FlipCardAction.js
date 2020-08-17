const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let mouseX, mouseY;

const colors = ["#50514f", "#f25f5c", "#ffe066", "#247ba0", "#70c1b3"];


addEventListener("mousemove", e => {
	mouseX = e.clientX;
	mouseY = e.clientY;

	//console.log("mouseX: " + mouseX);
	//console.log("mouseY: " + mouseY);
});

addEventListener("mouseup", e => {

})

addEventListener("mousedown", e => {
	for(let i = 0 ; i < notes.length ; i++){
		if(mouseX > notes[i].x && mouseX < notes[i].x + notes[i].width && 
			mouseY > notes[i].y && mouseY < notes[i].y + notes[i].height){
			notes[i].isFlipped = !notes[i].isFlipped;
		
			break;
		}
	}
});



function setTheBoundary(){
	c.beginPath();
	c.moveTo(noteListBoxX, 0);
	c.lineTo(noteListBoxX, noteListBoxY);
	c.stroke();
}

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2){
	const xDist = x2 - x1;
	const yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function randomColor(){
	console.log(colors.length);
	return colors[Math.floor(Math.random() * colors.length)];
}

function resolveCollision(particle, otherParticle) {
    
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


class Note{
	constructor(width, height, x, y, color){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;


		this.isFlipped = false;
		this.yGap = 180;
	}

	draw(){
		c.beginPath();
		c.fillStyle = this.isFlipped ? this.color : "black"; 
		c.fillRect(this.x, this.y, this.width, this.height);
		c.closePath();
	}

	update(){
		this.draw();

	}
}

class Name{
	constructor(x, y, radius, color){
		this.names = [];

		this.velocity = {
			x: Math.random() + 2,
			y: Math.random() + 2
		}

		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.mass = 1;
	}

	draw(){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}

	update(){
		this.draw();

		for(let i = 0 ; i < names.length ; i++){
			if(this == names[i]) continue;

			if(distance(this.x, this.y, names[i].x, names[i].y) - this.radius * 2 < 0){
				resolveCollision(this, names[i]);
			}
		}

		if(this.x - this.radius <= 0 || this.x + this.radius >= noteListBoxX){
			this.velocity.x = -this.velocity.x;
		}

		if(this.y - this.radius <= 0 || this.y + this.radius >= noteListBoxY){
			this.velocity.y = -this.velocity.y;
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}

const noteListBoxX = canvas.width * 4 / 5;
const noteListBoxY = canvas.height;

let notes, names;

function init(){
	notes = [];
	names = [];

	let rectWidth = 100;
	let rectHeight = 130;
	let noteListWidth = canvas.width - noteListBoxX;

	notes.push(new Note(rectWidth, rectHeight, noteListBoxX + (noteListWidth - rectWidth) / 2, 30, randomColor()));
	
	for(let i = 1 ; i < 5 ; i++){
		notes.push(new Note(rectWidth, rectHeight, notes[i-1].x, notes[notes.length-1].y + notes[i-1].yGap, randomColor()));	

	}

	for(let i = 0 ; i < 5 ; i++){
		const radius = 50;
		let x = randomIntFromRange(radius, noteListBoxX - radius);
		let y = randomIntFromRange(radius, noteListBoxY - radius);
		const color = "blue";
		
		for(let j = 0 ; j < names.length ; j++){
			if(distance(x, y, names[j].x, names[j].y) - radius * 2 < 0){
				x = randomIntFromRange(radius, noteListBoxX - radius);
				y = randomIntFromRange(radius, noteListBoxY - radius);
		
				j = -1;
			}
		}
		
		names.push(new Name(x, y, radius, color));			
	}

}


function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	setTheBoundary();

	notes.forEach(note => {
		note.update();
	});

	names.forEach(name => {
		name.update();
	});
}

init();
animate();