const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


const colors = ["#E0FEFE", "#C7CEEA", "#FFDAC1", "#FF9AA2", "#B5EAD7"];

addEventListener("mouseup", e => {
	if(e.clientX > blankTile.x && e.clientX < blankTile.x + blankTile.width && 
		e.clientY > blankTile.y && e.clientY < blankTile.y + blankTile.height){
		blankTile.isClicked = true;

		for(let i = 0 ; i < notes.length ; i++){
			if(!notes[i].isCorrect && !notes[i].isOnLine){
				notes[i].isCorrect = true;
				break;
			}
			
			else if(!notes[i].isCorrect && notes[i].isOnLine && !success){
				setInitCorrectInNotes();
				break;
			}
		}
	}

	if(e.clientX > lineTile.x && e.clientX < lineTile.x + lineTile.width && 
		e.clientY > lineTile.y && e.clientY < lineTile.y + lineTile.height){
		lineTile.isClicked = true;
		
		for(let i = 0 ; i < notes.length ; i++){
			if(!notes[i].isCorrect && notes[i].isOnLine){
				notes[i].isCorrect = true;
				break;
			}

			else if(!notes[i].isCorrect && !notes[i].isOnLine && !success){
				setInitCorrectInNotes();
				break;
			}
		}
	}
});



class MusicPaper{
	constructor(x, y, length){
		this.x = x;
		this.y = y;

		this.length = length;
	}

	draw(){
		c.beginPath();
		c.strokeStyle = "black";

		c.lineWidth = 3;

		c.moveTo(this.x, this.y);
		c.lineTo(this.length, this.y);

		c.closePath();
		c.stroke();
	}
}

class Note{
	constructor(x, y, radius, color, isOnLine){
		this.x = x;
		this.y = y;

		this.color = color;
		this.radius = radius;
		this.originalRadius = radius;

		this.isOnLine = isOnLine;

		this.init();
	}

	init(){
		this.opacity = 0.1;
		this.do = 0.01;
		this.radius = this.originalRadius;

		this.isCorrect = false;
	}

	draw(x, y, color, opacity){
		c.beginPath();
		c.save();

		c.globalAlpha = opacity;

		c.fillStyle = color;
		c.arc(x, y, this.radius, 0, Math.PI * 2, false);
		c.closePath();

		c.fill();

		c.restore();
	}

	update(){
		if(this.opacity <= 1){
			this.opacity+=this.do;
			this.do+=0.001;
		}

		if(this.opacity <= 0.5){
			this.radius+=3;
		}
		else if(this.opacity < 1)
			this.radius-=3;

		this.draw(this.x, this.y, this.color, this.opacity);
	}
}

class Tile{
	constructor(x, y, width, height, text, textWidth, font, color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.text = text;
		this.textWidth = textWidth;
		this.font = font;

		this.color = color;

		this.isClicked = false;

		this.init();
	}

	init(){
		this.smallRectX = (this.x + (this.x + this.width)) / 2;
		this.smallRectY = (this.y + (this.y + this.height)) / 2;
		this.smallRectWidth = 1;
		this.smallRectHeight = 1;

		this.dx = 0.5;
		this.dy = 0.5;
		this.dw = this.dx * 2;
		this.dh = this.dy * 2;
	}

	draw(){
		c.font = this.textWidth + "px " + this.font;
		c.fillStyle = this.color;
		c.fillText(this.text, (this.x + (this.x + this.width)) / 2 - this.textWidth, (this.y + (this.y + this.height)) / 2);

		c.strokeStyle = this.color;
		c.strokeRect(this.x, this.y, this.width, this.height);
	}

}

function randomIntRange(min, max){
	return parseInt((Math.random() * (max - min)) + min);
}

function setInitCorrectInNotes(){
	for(let i = 0 ; i < notes.length ; i++){
		notes[i].init();
	}
}

function isSuccess(){
	for(let i = 0 ; i < notes.length ; i++){
		if(!notes[i].isCorrect)
			return;
	}

	success = true;
}

let lines, notes, blankTile, lineTile, success;

function init(){
	success = false;

	let x = 0;
	let y = canvas.height / 7;
	let width = 0;
	let height = canvas.width / 3;

	// Music Paper
	let gap = canvas.height / 15;
	
	lines = [];
	
	x = 70;

	lines.push(new MusicPaper(x, y, x + canvas.width / 2.5));
	for(let i = 1 ; i < 5 ; i++){
		lines.push(new MusicPaper(lines[i-1].x, lines[i-1].y + gap, x + canvas.width / 2.5));
	}

	// Note
	notes = [];

	let p = randomIntRange(lines.length - 2, lines.length - 1);
	
	if(Math.random() - 0.5 >= 0)
		notes.push(new Note(x + (2 * gap), (lines[p].y + lines[p+1].y) / 2, gap / 2, colors[0], false));
	
	else{
		p = randomIntRange(3, 4);
		notes.push(new Note(x + (2 * gap), lines[p].y, gap / 2, colors[0], true));
	}

	for(let i = 1 ; i < 4 ; i++){
		if(notes[i-1].x + (2 * gap) + (gap / 2) > lines[0].length)
			break;

		
		if(Math.random() - 0.5 >= 0){
			p = randomIntRange(lines.length - 2, lines.length - 1);
			notes.push(new Note(notes[i-1].x + (2 * gap), (lines[p].y + lines[p+1].y) / 2, gap / 2, colors[i], false));
		}
		else{
			p = randomIntRange(lines.length - 2, lines.length - 1);
			notes.push(new Note(notes[i-1].x + (2 * gap), lines[p].y, gap / 2, colors[i], true));
		}
		
	}

	// Music Paper
	lines = [];
	lines.push(new MusicPaper(x, y, notes[notes.length-1].x + 2 * gap));
	for(let i = 1 ; i < 5 ; i++){
		lines.push(new MusicPaper(x, lines[i-1].y + gap, notes[notes.length-1].x + 2 * gap));
	}

	// Tile
	blankTile = new Tile(x + gap, lines[lines.length-1].y + (gap * 1.5), lines[0].length / 5, lines[0].length / 5, "F", 30, "serif", "#FC766AFF");
	lineTile = new Tile(x + blankTile.width + gap + gap, blankTile.y, blankTile.width, blankTile.height, "G", 30, "serif", "#5B84B1FF");
}


function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	lines.forEach(line => line.draw());
	notes.forEach(note => {
		if(note.isCorrect)
			note.update();
		else
			note.draw(note.x, note.y, "black", 1);
	});

	blankTile.draw();
	lineTile.draw();
}

init();
animate();