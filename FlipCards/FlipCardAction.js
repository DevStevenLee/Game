const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


class Note{
	constructor(){
		this.notes = [];
	}

	insertNote(img){
		let note = {};
		note.img = new Image();
		note.img.src = img;

		//note.width = note.img.width;
		//note.height = note.img.height;

		note.x = (canvas.width / 4) * (this.notes.length + 1);
		note.y = 150;

		this.notes.push(note); 
		console.log(this.notes[0]);
		console.log(this.notes[0].img);
		console.log("width: " + note.img.width);
		console.log("height: " + note.img.height);
	}
	/*
	drawImage(){
		for(let i = 0 ; i < this.notes.length ; i++){
			this.notes[i];
		}
	}
	*/
}

let note;
function init(){
	note = new Note();
	note.insertNote("./wholeNote.png");
	note.insertNote("./halfNote.png");
	note.insertNote("./quarterNote.png");
	note.insertNote("./eighthNote.png");

}

init();