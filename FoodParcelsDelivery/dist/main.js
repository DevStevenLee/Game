import * as foodCard from "../src/DragAndDrop.js";
import { lid } from "../src/Lid.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

function init(){

}

foodCard.handleEvents();

function animation(){
	requestAnimationFrame(animation);
	
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	foodCard.foodCards.forEach( foodCard =>{
		foodCard.draw();
	});

	lid.draw();
}

animation();