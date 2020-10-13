import * as foodCard from "../src/DragAndDrop.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

function init(){

}

function animation(){
	c.clearRect(0, 0, canvas.width, canvas.height);

	foodCard.handleEvents();
	foodCard.foodCards.forEach( foodCard =>{
		foodCard.draw();
	});
}

animation();