const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;




let holding, mark;
class Note{
	constructor(){
		this.notes = [];
	}

	insertNote(img){
		let note = {};
		note.img = new Image();
		note.img.src = img;

		note.x = (canvas.width / 4) * (this.notes.length) + 50;
		note.y = 150;

		this.notes.push(note); 
	}
	
	drawImgInit(){
		for(let i = 0 ; i < this.notes.length ; i++){
			this.notes[i].img.addEventListener("load", e => {
				c.drawImage(this.notes[i].img, this.notes[i].x, this.notes[i].y);
			});
		}
	}

	drawImg(){
		for(let i = 0 ; i < this.notes.length ; i++){
			c.drawImage(this.notes[i].img, this.notes[i].x, this.notes[i].y);
		}
	}
	

	mouseMove(){
		this.notes[mark].x = mouseX - (this.notes[mark].img.width / 2);
		this.notes[mark].y = mouseY - (this.notes[mark].img.height / 2);
	}

	mouseUp(){
		holding = false;
	}

	mouseDown(){
		if(holding) return;

		mark = -1;

		for(let i = 0 ; i < this.notes.length ; i++){
			if(mouseX > this.notes[i].x && mouseX < this.notes[i].x + this.notes[i].img.width &&
			   mouseY > this.notes[i].y && mouseY < this.notes[i].y + this.notes[i].img.height){
				mark = i;
			}
		}
		
		if(mark != -1)
			holding = true;
	}
}

let mouseX, mouseY;


addEventListener("mousemove", e => {
	mouseX = e.clientX;
	mouseY = e.clientY;

	if(holding) note.mouseMove();
});

addEventListener("mouseup", e => {
	note.mouseUp();
})

addEventListener("mousedown", e => {
	note.mouseDown();
});


let note;
function init(){
	note = new Note();
	note.insertNote("./img/wholeNote.png");
	note.insertNote("./img/halfNote.png");
	note.insertNote("./img/quarterNote.png");
	note.insertNote("./img/eighthNote.png");

	note.drawImgInit();
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	note.drawImg();	
	note.update();
}

init();
animate();