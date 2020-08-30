const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const closedTreasureBoxImg = new Image();
const openedTreasureBoxImg = new Image();
const backgroundImg = new Image();


closedTreasureBoxImg.src = "./img/ClosedTreasureBox.png";
openedTreasureBoxImg.src = "./img/OpenedTreasureBox.png";
backgroundImg.src = "./img/background.png";


closedTreasureBoxImg.addEventListener("load", function(){
	c.drawImage(closedTreasureBoxImg, 0, 0);
});

openedTreasureBoxImg.addEventListener("load", function(){
	c.drawImage(openedTreasureBoxImg, 0, 0);
});

backgroundImg.addEventListener("load", function(){
	c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
});



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


const colors = ["#E0FEFE", "#C7CEEA", "#FFDAC1", "#FF9AA2", "#B5EAD7"];

class TreasureBox{
	constructor(x, y, width, height, img, opacity, delta){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;

		this.opacity = opacity;
		this.delta = delta;
	}

	draw(){
		c.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	update(){
		c.globalAlpha = this.opacity;
		this.opacity -= this.delta;

		this.draw();
	}
}

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

		this.isOnLine = isOnLine;

		this.init();
	}

	init(){
		this.yForCorrect = (this.y - this.radius * 4);

		this.dy = 2;
		this.gravitiy = 2;
		this.friction = 0.85;
		this.opacity = 0.1;
		this.do = 0.01;

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
		if(this.yForCorrect + this.dy > this.y)
			this.dy = -this.dy * this.friction;
		else
			this.dy += this.gravitiy;

		this.yForCorrect += this.dy;
		this.opacity+=this.do;
		this.do+=0.001;

		this.draw(this.x, this.yForCorrect, this.color, this.opacity);
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


	update(){
		c.fillStyle = this.color;

		c.save();

		c.fillRect(this.smallRectX, this.smallRectY, this.smallRectWidth, this.smallRectHeight);

		this.smallRectX-=this.dx;
		this.smallRectY-=this.dy;
		this.smallRectWidth+=this.dw;
		this.smallRectHeight+=this.dh;

		this.dx+=0.4;
		this.dy+=0.4;
		this.dw+=0.8;
		this.dh+=0.8;

		if(this.smallRectX < this.x && this.smallRectY < this.y && this.smallRectWidth > this.width && this.smallRectHeight > this.height){
			this.init();
			this.isClicked = false;
		}

		c.restore();

		this.draw();

	}


}


class Text{
	constructor(x, y, write, width, font){
		this.x = x;
		this.y = y;

		this.write = write;
		this.width = width;
		this.font = font;
	}

	draw(){
		c.fillStyle = "black";

		c.font = this.width + "px " + this.font;
		c.fillText(this.write, this.x, this.y);
	}

}

let closedTreasureBox, openedTreasureBox;
let lines, notes, blankTile, lineTile;

let textHint, success;

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

function init(){
	// Treasure Box
	success = false;

	let x = canvas.width / 10;
	let y = canvas.height / 7;
	let width = canvas.width / 3;
	let height = canvas.width / 3;
	
	let opacity = 1;
	let delta = 0.01;

	closedTreasureBox = new TreasureBox(x, y, width, height, closedTreasureBoxImg, opacity, delta);
	openedTreasureBox = new TreasureBox(x, y, width, height, openedTreasureBoxImg, opacity, delta);


	// Music Paper
	let gap = canvas.height / 15;
	
	lines = [];
	
	x = x + width + 70;

	lines.push(new MusicPaper(x, y, x + canvas.width / 2.5));
	for(let i = 1 ; i < 5 ; i++){
		lines.push(new MusicPaper(lines[i-1].x, lines[i-1].y + gap, x + canvas.width / 2.5));
	}


	// Note
	notes = [];

	let p = randomIntRange(0, lines.length - 1);
	
	if(Math.random() - 0.5 >= 0)
		notes.push(new Note(x + (2 * gap), (lines[p].y + lines[p+1].y) / 2, gap / 2, colors[0], false));
	
	else{
		p = randomIntRange(0, lines.length);
		notes.push(new Note(x + (2 * gap), lines[p].y, gap / 2, colors[0], true));
	}

	for(let i = 1 ; i < 7 ; i++){
		if(notes[i-1].x + (2 * gap) + (gap / 2) > lines[0].length)
			break;

		
		if(Math.random() - 0.5 >= 0){
			p = randomIntRange(0, lines.length - 1);
			notes.push(new Note(notes[i-1].x + (2 * gap), (lines[p].y + lines[p+1].y) / 2, gap / 2, colors[i], false));
		}
		else{
			p = randomIntRange(0, lines.length);
			notes.push(new Note(notes[i-1].x + (2 * gap), lines[p].y, gap / 2, colors[i], true));
		}
		
	}

	// Hint Text
	textHint = new Text(x, canvas.height / 10, "Hint", 80, "serif");


	// Tile
	blankTile = new Tile(x, lines[lines.length-1].y + (gap * 1.5), lines[0].length / 5, lines[0].length / 5, "Blank", 30, "serif", "#FC766AFF");
	lineTile = new Tile(x + blankTile.width + gap, blankTile.y, blankTile.width, blankTile.height, "Line", 30, "serif", "#5B84B1FF");

}

function animate(){
	requestAnimationFrame(animate);
	c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

	lines.forEach(line => line.draw());
	notes.forEach(note => {
		if(note.isCorrect)
			note.update();
		else
			note.draw(note.x, note.y, "black", 1);
	});

	textHint.draw();

	blankTile.draw();
	lineTile.draw();

	if(blankTile.isClicked)
		blankTile.update();
	if(lineTile.isClicked)
		lineTile.update();
	
	c.save();

	isSuccess();
	if(success && closedTreasureBox.opacity > 0)
		closedTreasureBox.update();
	else if(success)
		openedTreasureBox.draw();
	else
		closedTreasureBox.draw();

	c.restore();
}

init();
animate();