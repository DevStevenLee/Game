import * as colors from "./Colors.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class FadeCard{
	constructor(x, y, w, h, bx, by, bw, bh, alpha, delta, color){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.bx = bx;
		this.by = by;
		this.bw = bw;
		this.bh = bh;
		
		this.alpha = alpha;
		this.delta = delta;
		
		this.color = color;
	}
	
	draw(){
		c.save();
    	c.globalAlpha = this.alpha;
    	c.fillStyle = this.color;
    	c.fillRect(this.x, this.y, this.w, this.h);
		c.restore();
		
		c.strokeRect(this.bx, this.by, this.bw, this.bh);
	}
	
	
	fadeInRectangle() {
		if(this.alpha <= 1){
    		this.alpha += this.delta;
		}
		
		this.draw();
	}
	
}

let fadeCards;

function init(){
	fadeCards = [];
	
	let bx = window.innerWidth / 25;
	let by = (window.innerHeight / 9) * 6.8;
	let bh = (window.innerHeight / 9) * 2;
	let bw = bh * 0.69;
	
	let h = bh / 6 * 4;
	let w = h * 0.69;
	let x = bx + bw / 2 - w / 2;
	let y = by + bh / 2 - h / 2;
	
	let alpha = 0;
	let delta = 0.01;

	for(let i = 0 ; i < colors.cardColors2.length ; i++){
		fadeCards.push(new FadeCard(x, y, w, h, bx, by, bw, bh, alpha, delta, colors.cardColors2[i]));
	}
}



function animation(){
	if(fadeCards.length >= 1)
		fadeCards[0].fadeInRectangle();
}

export { init, animation, fadeCards };
