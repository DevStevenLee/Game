import * as arrow from '../src/MovingTheArrow.js';
import * as targets from "../src/Targets.js";
import * as fadecard from "../src/FadeCard.js";
import * as fillstar from "../src/fillStar.js";
import * as colors from "../src/Colors.js";


const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


arrow.init();
targets.init();

fillstar.init();

colors.makeColorsForTargets();
targets.setColorsToTheCard();
fadecard.init();

function animation(){
	requestAnimationFrame(animation);
	
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	targets.animation();
	fadecard.animation();
	
	arrow.animation();
	
	fillstar.animation();
}

animation();