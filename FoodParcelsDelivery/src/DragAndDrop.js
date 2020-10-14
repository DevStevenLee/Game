import { foodCards } from "./FoodCards.js";

let isMouseHold = false;

let selectedCardIdx;
let offset = {};


function handleEvents(){
	addEventListener("mousedown", e => {
		for(let i = 0 ; i < foodCards.length ; i++){
			if(e.clientX > foodCards[i].x && e.clientX < foodCards[i].x + foodCards[i].width && 
				e.clientY > foodCards[i].y && e.clientY < foodCards[i].y + foodCards[i].height){

				isMouseHold = true;
				selectedCardIdx = i;
				
				addEventListener("mousemove", e => {
					onMouseMove(e);
				});

				addEventListener("mouseup", e => {
					onMouseUp(e);
				});
		
				offset.x = e.clientX - foodCards[i].x;
				offset.y = e.clientY - foodCards[i].y;

				break;
			}
		}
	});

}

function onMouseMove(e){
	if(isMouseHold){
		foodCards[selectedCardIdx].x = e.clientX - offset.x;
		foodCards[selectedCardIdx].y = e.clientY - offset.y;
	}
}

function onMouseUp(e){
	if(!isMouseHold) return;
 	isMouseHold = false;
}

export { foodCards, handleEvents };
