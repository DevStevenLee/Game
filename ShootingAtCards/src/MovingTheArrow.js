const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");


canvas.width = innerWidth;
canvas.height = innerHeight;

class Arrow{
	constructor(radius, centerX, centerY, toX, toY, arrowHeadSize){
		this.radius = radius;
		this.centerX = centerX;
		this.centerY = centerY;
		this.toX = toX;
		this.toY = toY;

		this.arrowHeadSize = arrowHeadSize;

		this.inclination = (this.toY - this.centerY) / (this.toX - this.centerX);
	}

	linearEquationForArrowByCenter(nextX){
		return (this.inclination * nextX) - (this.inclination * this.centerX) + this.centerY;
	}	

	linearEquationForArrowByTo(nextX){
		return (this.inclination * nextX) - (this.inclination * this.toX) + this.toY;
	}	

	drawArrow(centerX, centerY, toX, toY){
		let dx = toX - centerX;
		let dy = toY - centerY;

		let angle = Math.atan2(dy, dx);
		
		c.beginPath();

		c.moveTo(centerX, centerY);
		c.lineTo(toX, toY);
		c.lineTo(toX - this.arrowHeadSize * Math.cos(angle - Math.PI / 6), toY - this.arrowHeadSize * Math.sin(angle - Math.PI / 6));
		c.moveTo(toX, toY);
		c.lineTo(toX - this.arrowHeadSize * Math.cos(angle + Math.PI / 6), toY - this.arrowHeadSize * Math.sin(angle + Math.PI / 6));
	
		c.stroke();

		c.closePath();
	}

	drawMotionOfShooting(dist){
		this.drawArrow(this.centerX + dist, this.linearEquationForArrowByCenter(this.centerX + dist),
						this.toX + dist, this.linearEquationForArrowByTo(this.toX + dist));
	}
}

function toRadians(degree){
	return degree * (Math.PI / 180);
}

let arrow;
let speed = 1;
function init(){
	arrow = [];

	let radius = 180;
	let centerX = canvas.width / 2;
	let centerY = canvas.height - 10;
	let arrowHeadSize = 20;

	for(let i = 180 ; i <= 360 ; i+=speed){
		let toX = Math.floor(radius * Math.cos(toRadians(i)));
		let toY = Math.floor(radius * Math.sin(toRadians(i)));
	
		arrow.push(new Arrow(radius, centerX, centerY, centerX + toX, centerY + toY, arrowHeadSize));
		speed+=0.03;
	}

}

let nowArrowPosi = -1;
let idx = 1;
function animation(){
	requestAnimationFrame(animation);
	c.clearRect(0, 0, canvas.width, canvas.height);

	if(nowArrowPosi >= arrow.length - 1)
		idx = -1;
	else if(nowArrowPosi <= 0)
		idx = 1;

	nowArrowPosi+=idx;
	arrow[30].drawMotionOfShooting(nowArrowPosi);
	//arrow[nowArrowPosi].drawArrow(arrow[nowArrowPosi].centerX, arrow[nowArrowPosi].centerY, arrow[nowArrowPosi].toX, arrow[nowArrowPosi].toY);
}

init();
animation();