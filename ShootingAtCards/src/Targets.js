const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Card{
	constructor(x, y, width, height, color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.color = color;
	}

	drawCard(){
		c.fillRect(this.x, this.y, this.width, this.height);
	}

}

let cards = [];
const gapBetweenCards = 50;
const rectWidth = canvas.width / 13;
const rectHeight = canvas.width / 9;

function init(){
	let x = gapBetweenCards;
	let y = gapBetweenCards;
	while(x + rectWidth < canvas.width){
		cards.push(new Card(x, y, rectWidth, rectHeight, "black"));

		x = x + rectWidth + gapBetweenCards;
	}

	cards.forEach(card => {
		console.log("x: " + card.x + " y: " + card.y);
	})
}

function animation(){
	requestAnimationFrame(animation);

	c.clearRect(0, 0, canvas.width, canvas.height);

	cards.forEach(card => {
		card.drawCard();
	})
}

init();
animation();