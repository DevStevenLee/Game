import * as foodCard from "./FoodCards.js";

let isMouseHold = false;

let selectedCardIdx;
let offset = {};


function handleEvents(){
	addEventListener("mousedown", e => {
		for(let i = 0 ; i < foodCard.foodCards.length ; i++){
			if(e.clientX > foodCard.foodCards[i].x && e.clientX < foodCard.foodCards[i].x + foodCard.foodCards[i].width && 
				e.clientY > foodCard.foodCards[i].y && e.clientY < foodCard.foodCards[i].y + foodCard.foodCards[i].height){

				isMouseHold = true;
				selectedCardIdx = i;

				addEventListener("mousemove", e => {
					onMouseMove(e);
				});

				addEventListener("mouseup", e => {
					onMouseUp(e);
				});
		
				offset.x = e.clientX - notes[i].x;
				offset.y = e.clientY - notes[i].y;

				break;
			}
		}
	});


	function onMouseMove(e){
		if(isMouseHold){
			foodCard.foodCards[selectedCardIdx].x = e.clientX - offset.x;
			[idx].y = e.clientY - offset.y;
		}
	}

	function onMouseUp(e){
		if(!isMouseHold) return;
 		isMouseHold = false;

		removeEventListener("mousemove", onMouseMove);
		removeEventListener("mouseup", onMouseUp);
	}
}

export { foodCard, handleEvents };
