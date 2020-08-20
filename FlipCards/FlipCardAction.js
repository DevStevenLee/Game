const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ["#50514f", "#f25f5c", "#ffe066", "#247ba0", "#70c1b3"];
let offset = {};

let isMouseHold = false;
let isNoteAndNameCollision = false;
let idx;

addEventListener("mousedown", e => {
	for(let i = 0 ; i < notes.length ; i++){
		if(e.clientX > notes[i].x && e.clientX < notes[i].x + notes[i].width && 
			e.clientY > notes[i].y && e.clientY < notes[i].y + notes[i].height){

			isMouseHold = true;

			for(let j = 0 ; j < notes.length ; j++){
				if(j == i) continue;
				notes[j].isFlipped = false;
			}

			idx = i;

			addEventListener("mousemove", e => {
				onMouseMove(e);
			});

			addEventListener("mouseup", e => {
				onMouseUp(e);
			});

			notes[i].isFlipped = !notes[i].isFlipped;
		
			offset.x = e.clientX - notes[i].x;
			offset.y = e.clientY - notes[i].y;

			break;
		}
	}
});


function onMouseMove(e){
	if(notes[idx].isFlipped && isMouseHold){
		notes[idx].x = e.clientX - offset.x;
		notes[idx].y = e.clientY - offset.y;

		for(let i = 0 ; i < particles.length ; i++){
			particles[i].x = notes[idx].x + (notes[idx].width / 2);
			particles[i].y = notes[idx].y + (notes[idx].height / 2);
		}
	}
}

function onMouseUp(e){
	if(!isMouseHold) return;
 	isMouseHold = false;

	removeEventListener("mousemove", onMouseMove);
	removeEventListener("mouseup", onMouseUp);

	for(let i = 0 ; i < names.length ; i++){
		let dx = (notes[idx].x + (notes[idx].x + notes[idx].width)) / 2 - names[i].x;
		let dy = (notes[idx].y + (notes[idx].y + notes[idx].height)) / 2 - names[i].y;

		dx = dx * dx;
		dy = dy * dy;

		if(Math.sqrt(dx + dy) < names[i].radius && notes[idx].color === names[i].color){
			isNoteAndNameCollision = true;
			notes.splice(idx, 1);
			names.splice(i, 1);

			return;
		}
	}

	notes[idx].x = notes[idx].offset.x;
	notes[idx].y = notes[idx].offset.y;
	notes[idx].width = notes[idx].offset.width;
	notes[idx].height = notes[idx].offset.height;
}


function setTheBoundary(){
	c.beginPath();
	c.moveTo(noteListBoxX, 0);
	c.lineTo(noteListBoxX, noteListBoxY);
	c.stroke();
	c.closePath();
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

function randomColor(copyColors){
	let rand = Math.floor(Math.random() * copyColors.length);
	let color = copyColors[rand];
	
	copyColors.splice(rand, 1);

	return color;
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
	constructor(x, y, width, height, color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;

		this.isFlipped = false;
		this.yGap = 180;
		this.offset = { "x": this.x,
						"y": this.y,
						"width": this.width, 
						"height": this.height
						};
	}

	draw(){
		c.beginPath();
		c.fillStyle = this.isFlipped ? this.color : "black"; 
		c.fillRect(this.x, this.y, this.width, this.height);
		
		c.lineWidth = 3;
		c.strokeStyle = "silver";
		c.strokeRect(this.x, this.y, this.width, this.height);
		c.lineWidth = 1;
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
			x: Math.random() + 1,
			y: Math.random() + 1
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


class Particle{
	constructor(x, y, radius){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.offset = {
			x: this.x,
			y: this.y,
			radius: this.radius
		};

		this.velocity = {
			x: randomIntFromRange(-3, 3),
			y: randomIntFromRange(-3, 3)
		};

		this.decreaseRate = 0.1;
	}

	init(){
		this.x = this.offset.x;
		this.y = this.offset.y;

		this.radius = this.offset.radius;

		this.color = colors[Math.floor(Math.random() * colors.length)];
		
		this.velocity = {
			x: randomIntFromRange(-3, 3),
			y: randomIntFromRange(-3, 3)
		}
		
		this.decreaseRate = 0.1;
		isNoteAndNameCollision = false;
	}

	draw(){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}

	update(){
		if(this.x - this.radius <= 0 || this.x + this.radius >= noteListBoxX)
			this.velocity.x = -this.velocity.x;

		if(this.y - this.radius <= 0 || this.y + this.radius >= noteListBoxY)
			this.velocity.y = -this.velocity.y;

		if(this.radius < 0){
			this.init();
			return;
		}

		this.draw();

		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.radius -= this.decreaseRate;
		this.decreaseRate += 0.08;
	}

}

const noteListBoxX = canvas.width * 4 / 5;
const noteListBoxY = canvas.height;

let notes, names, particles;

function init(){
	notes = [];
	names = [];
	particles = [];

	let rectWidth = 100;
	let rectHeight = 130;
	let noteListWidth = canvas.width - noteListBoxX;

	let copyColors = [...colors];

	notes.push(new Note(noteListBoxX + (noteListWidth - rectWidth) / 2, 30, rectWidth, rectHeight, randomColor(copyColors)));
	
	for(let i = 1 ; i < 5 ; i++){
		notes.push(new Note( notes[i-1].x, notes[notes.length-1].y + notes[i-1].yGap, rectWidth, rectHeight, randomColor(copyColors)));	

	}

	copyColors = [...colors];

	for(let i = 0 ; i < 5 ; i++){
		const radius = 70;
		let x = randomIntFromRange(radius, noteListBoxX - radius);
		let y = randomIntFromRange(radius, noteListBoxY - radius);
		
		for(let j = 0 ; j < names.length ; j++){
			if(distance(x, y, names[j].x, names[j].y) - radius * 2 < 0){
				x = randomIntFromRange(radius, noteListBoxX - radius);
				y = randomIntFromRange(radius, noteListBoxY - radius);
		
				j = -1;
			}
		}
		
		names.push(new Name(x, y, radius, randomColor(copyColors)));			
	}

	copyColors = [...colors];
	for(let i = 0 ; i < 10 ; i++){
		particles.push(new Particle(canvas.width / 2, canvas.height / 2, 30));
	}

}


function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	setTheBoundary();

	names.forEach(name => {
		name.update();
	});
	
	notes.forEach(note => {
		note.update();
	});


	if(isNoteAndNameCollision){
		particles.forEach(particle => {
			particle.update();
		});
	}
}

init();
animate();