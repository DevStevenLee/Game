import { foodCards } from "./FoodCards.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


class Lid{
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
}


let lid;
function init(){
	let x = foodCards[0].x;
	let y = foodCards[0].y - foodCards[0].height;
	let height = foodCards[0].height * 2;
	let width = foodCards[0].width * 2;

	lid = new Lid(x, y, height, width);
}

export { lid };