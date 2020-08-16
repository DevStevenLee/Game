const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let mouseX, mouseY;


addEventListener("mousemove", e => {
	mouseX = e.clientX;
	mouseY = e.clientY;

});

addEventListener("mouseup", e => {

})

addEventListener("mousedown", e => {

});

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2){
	const xDist = x2 - x1;
	const yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

class Note{
	constructor(width, height, x, y, color){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;

		this.yGap = 180;
	}

	draw(){
		c.beginPath();
		c.fillStyle = this.color;
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

		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
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
	}
}

const noteListBoxX = canvas.width * 4 / 5;
const noteListBoxY = canvas.height;

function setTheBoundary(){
	c.beginPath();
	c.moveTo(noteListBoxX, 0);
	c.lineTo(noteListBoxX, noteListBoxY);
	c.stroke();
}

let notes, names;

function init(){
	notes = [];
	names = [];

	let rectWidth = 100;
	let rectHeight = 130;
	let noteListWidth = canvas.width - noteListBoxX;

	notes.push(new Note(rectWidth, rectHeight, noteListBoxX + (noteListWidth - rectWidth) / 2, 30, "black"));
	
	for(let i = 1 ; i < 5 ; i++){
		notes.push(new Note(rectWidth, rectHeight, notes[i-1].x, notes[notes.length-1].y + notes[i-1].yGap, "black"));	

	}

	console.log(notes)

	for(let i = 0 ; i < 5 ; i++){
		const radius = 30;
		const x = randomIntFromRange(radius, noteListBoxX - radius);
		const y = randomIntFromRange(radius, noteListBoxY - radius);
		const color = "blue";

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