import * as colors from "./Colors.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Card{
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	drawCard(){
		c.fillStyle = this.color;
		c.fillRect(this.x, this.y, this.width, this.height);
		
		c.lineWidth = 3;
		c.strokeStyle = "silver";
		c.strokeRect(this.x, this.y, this.width, this.height);
		c.lineWidth = 1;
		
		c.strokeStyle = "black";
		c.closePath();
		
		c.fillStyle = "black";
	}
	
	setColors(color){
		this.color = color;
	}

}

let cards = [];
const gapBetweenCards = 50;
const rectWidth = canvas.width / 13;
const rectHeight = canvas.width / 9;
let cardlen = 0;

function init(){
	let x = gapBetweenCards;
	let y = gapBetweenCards;
	
	while(x + rectWidth < canvas.width){
		
		cards.push(new Card(x, y, rectWidth, rectHeight));

		x = x + rectWidth + gapBetweenCards;
	}
	cardlen = cards.length;
}

function setColorsToTheCard(){
	for(let i = 0 ; i < colors.cardColors1.length ; i++){
		cards[i].setColors(colors.cardColors1[i]);
	}
}

function animation(){
	cards.forEach(card => {
		card.drawCard();
	})
}

export { init, animation, setColorsToTheCard, cards,cardlen};