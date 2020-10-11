import * as arrow from './MovingTheArrow.js';
import * as targets from "../src/Targets.js";
var c = document.getElementById('canvas');

var ctx = c.getContext('2d');

var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;

var points = [];

var opt = {
	count: 4,
	range: {
	x: 20,
	y: 10
	},
	duration: {
		min: 20,
		max: 40
	},
	thickness: 2,
	strokeColor: 'yellow',
	level: 0.12, // 0.32 full 0.12
	curved: true
};

var rand = function(min, max){
	return Math.floor( (Math.random() * (max - min + 1) ) + min);
};

var ease = function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
};

ctx.lineJoin = 'round';
ctx.lineWidth = opt.thickness;
ctx.strokeStyle = opt.strokeColor;

var Point = function(config){
	this.anchorX = config.x;
	this.anchorY = config.y;
	this.x = config.x;
	this.y = config.y;
	this.setTarget();
};

Point.prototype.setTarget = function(){
	this.initialX = this.x;
	this.initialY = this.y;
	this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
	this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
	this.tick = 0;
	this.duration = rand(opt.duration.min, opt.duration.max);
}
Point.prototype.update = function(){
	var dx = this.targetX - this.x;
	var dy = this.targetY - this.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if(Math.abs(dist) <= 0){
		this.setTarget();
	}
	else{
		var t = this.tick;
		var b = this.initialY;
		var c = this.targetY - this.initialY;
		var d = this.duration;
		this.y = ease(t, b, c, d);
		b = this.initialX;
		c = this.targetX - this.initialX;
		d = this.duration;
		this.x = ease(t, b, c, d);
		this.tick++;
	}
};

Point.prototype.render = function(){
	ctx.beginPath();
	ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
	ctx.fillStyle = 'yellow';
	ctx.fill();
};

var updatePoints = function(){
	var i = points.length;
	while(i--){
		points[i].update();
	}
};

var renderPoints = function(){
	var i = points.length;
	while(i--){
		points[i].render();
	}
};

var renderShape = function(){
	ctx.beginPath();
	var pointCount = points.length;
	ctx.moveTo(points[0].x, points[0].y); 
	
	for (let i = 0; i < pointCount - 1; i++) {
		var c = (points[i].x + points[i + 1].x) / 2;
		var d = (points[i].y + points[i + 1].y) / 2;
		ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
	}
	
	ctx.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
	ctx.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
	ctx.closePath();
	ctx.fillStyle = 'yellow';
	ctx.fill();
	ctx.stroke();
};

var clear = function(){
  ctx.clearRect(0, 0, cw, ch);
};

var check = false;

var animation = function(){
	ctx.save();
	
	drawStar(window.innerWidth-window.innerWidth/9,window.innerHeight-
			 window.innerHeight/5,5,100,50,'black',3);

	ctx.clip();
	updatePoints();
	renderShape();
	ctx.restore();

	if (isChanged(arrow.isTheArrowCollided)){
		opt.level += 0.2 / targets.cardlen;
		init();
		updatePoints();
		if(opt.level >= 0.32)
			alert("다맞췃다~");
	}
	
};

function isChanged(isTheArrowCollided){
	if(check != isTheArrowCollided && isTheArrowCollided == true){
		check = true;
		return true;
	}
	else if(check != isTheArrowCollided && isTheArrowCollided == false){
		check = false;
		return false;
	}
}

var spacing = (cw + (opt.range.x * 2)) / (opt.count-1);
function init(){
	points = [];
	
	let i = opt.count + 2;
	while(i--){
		points.push(new Point({
			x: (spacing * (i - 1)) - opt.range.x,
			y: ch - (ch * opt.level)
		}));
	}
}

function drawStar(centerX, centerY, points, inner, outer, stroke, line) {
	// define the star
	ctx.beginPath();
	ctx.moveTo(centerX, centerY+outer);
	
	for (var i=0; i < 2*points+1; i++) {
		var r = (i % 2 == 0) ? outer : inner;
		var a = Math.PI * i / points;
		ctx.lineTo(centerX + r * Math.sin(a), centerY + r * Math.cos(a));
	};
	
	ctx.closePath();
	ctx.strokeStyle='#FFCC00';
	ctx.lineWidth=line;
	ctx.stroke()
}

export { init,animation };