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



class Note{
	constructor(width, height, x, y){
		this.notes = [];
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.yGap = 180;
	}

	makeNoteACard(x, y){
		var card = {};

		card["x"] = x;
		card["y"] = y;
		card["width"] = this.width;
		card["height"] = this.height;

		this.notes.push(card);
	}

	makeNoteCards(len){
		if(this.notes.length == 0){
			this.makeNoteACard(this.x, this.y);
			len--;
		}

		for(let i = 0 ; i < len ; i++){
			this.makeNoteACard(this.x, this.notes[this.notes.length-1].y + this.yGap);		
		}
	}

	drawCards(){
		for(let i = 0 ; i < this.notes.length ; i++){
			console.log(this.notes[i]);
			c.fillRect(this.notes[i].x, this.notes[i].y, this.notes[i].width, this.notes[i].height);
		}

	}

}

class Name{

}

const NoteListBoxX = canvas.width * 4 / 5;
const NoteListBoxY = canvas.height;

function setTheBoundary(){
	c.beginPath();
	c.moveTo(NoteListBoxX, 0);
	c.lineTo(NoteListBoxX, NoteListBoxY);
	c.stroke();
}

let note, name;

function init(){
	setTheBoundary();
	note = new Note(100, 130, NoteListBoxX + 40, 10);
	note.makeNoteCards(5);
	note.drawCards();
}

function animate(){

}

init();
//animate();