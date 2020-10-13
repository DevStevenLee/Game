const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


class FoodCard{
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw(){
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

let foodCards;
const gapBetweenCards = 200;
const rectWidth = canvas.width / 15;
const rectHeight = canvas.width / 12;


function init(){
	foodCards = [];

	let x = gapBetweenCards;
	let y = canvas.height - 1.3 * rectHeight;
	
	while(x + rectWidth < canvas.width){
		
		foodCards.push(new FoodCard(x, y, rectWidth, rectHeight));

		x = x + rectWidth + gapBetweenCards;
	}
}


export { foodCards };