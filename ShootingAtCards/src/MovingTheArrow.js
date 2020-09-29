const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


let isTheArrowShot = false;

addEventListener("keydown", e => {
	if(e.keyCode == 32)
		isTheArrowShot = true;
});


class Arrow{
	constructor(radius, centerX, centerY, toX, toY, arrowHeadSize){
		this.radius = radius;
		this.centerX = centerX;
		this.centerY = centerY;
		this.toX = toX;
		this.toY = toY;

		this.arrowH eadSize = arrowHeadSize;

		this.inclination = (this.toY - this.centerY) / (this.toX - this.centerX);
	}

	linearEquationForArrowByCenter(nextX){
		return (this.inclination * nextX) - (this.inclination * this.centerX) + this.centerY;
	}	

	linearEquationForArrowByTo(nextX){
		return (this.inclination * nextX) - (this.inclination * this.toX) + this.toY;
	}	

	drawArrow(centerX, centerY, toX, toY){
		if(this.isTheArrowOutOfTheMap(centerX, centerY)){
			isTheArrowShot = false;
			arrowMoveX = 0;
			return;
		}

		let dx = toX - centerX;
		let dy = toY - centerY;

		let angle = Math.atan2(dy, dx);

		c.beginPath();

		c.lineWidth = 1.5;

		c.moveTo(centerX, centerY);
		c.lineTo(toX, toY);
		c.lineTo(toX - this.arrowHeadSize * Math.cos(angle - Math.PI / 5), toY - this.arrowHeadSize * Math.sin(angle - Math.PI / 5));
		c.moveTo(toX, toY);
		c.lineTo(toX - this.arrowHeadSize * Math.cos(angle + Math.PI / 5), toY - this.arrowHeadSize * Math.sin(angle + Math.PI / 5));
	
		c.stroke();

		c.closePath();
	}

	drawMotionOfShooting(distance){
		if(isTheArrowShot)
			this.drawArrow(this.centerX + distance, this.linearEquationForArrowByCenter(this.centerX + distance),
							this.toX + distance, this.linearEquationForArrowByTo(this.toX + distance));
	}

	isTheArrowOutOfTheMap(centerX, centerY){
		if(centerX <= -100 || centerX >= canvas.width || centerY <= -100 || centerY >= canvas.height)
			return true;

		return false;
	}
}

function toRadians(degree){
	return degree * (Math.PI / 180);
}

let arrows;
let speed = 1;
function init(){
	arrows = [];

	let radius = 180;
	let centerX = canvas.width / 2;
	let centerY = canvas.height - 10;
	let arrowHeadSize = 20;

	for(let i = 180 ; i <= 360 ; i+=speed){
		let toX = Math.floor(radius * Math.cos(toRadians(i)));
		let toY = Math.floor(radius * Math.sin(toRadians(i)));
	
		if(i <= 270)
			speed+=0.04;
		else if(i > 270){
			speed-=0.04;
		}

		arrows.push(new Arrow(radius, centerX, centerY, centerX + toX, centerY + toY, arrowHeadSize));
	}

	speed = 1;
	for(let i = 360 ; i >= 180 ; i-=speed){
		let toX = Math.floor(radius * Math.cos(toRadians(i)));
		let toY = Math.floor(radius * Math.sin(toRadians(i)));
	
		if(i > 270)
			speed+=0.04;
		else if(i <= 270){
			speed-=0.04;
		}

		arrows.push(new Arrow(radius, centerX, centerY, centerX + toX, centerY + toY, arrowHeadSize));
	}
}

let arrowIdx = 0;
let arrowMoveX = 0;
function animation(){
	requestAnimationFrame(animation);

	if(arrowIdx >= arrows.length - 1)
		arrowIdx = 0;

	if(!isTheArrowShot){
		c.clearRect(0, 0, canvas.width, canvas.height);
		arrows[arrowIdx].drawArrow(arrows[arrowIdx].centerX, arrows[arrowIdx].centerY, arrows[arrowIdx].toX, arrows[arrowIdx].toY);
		arrowIdx++;
	}
	else{
		c.fillStyle = "rgba(255, 255, 255, 0.3)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		
		if(arrows[arrowIdx].inclination >= 0)
			arrowMoveX--;
		else
			arrowMoveX++;

		arrows[arrowIdx].drawMotionOfShooting(arrowMoveX);
	}
}

init();
animation();