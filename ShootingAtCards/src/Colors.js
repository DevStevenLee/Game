import * as target from "./Targets.js";

const colors = ["#8DB6C7", "#C1B38E", "#D1C6BF", "#CA9F92", "#F9CD97", "#E3D9B0", "#B1C27A", "#B2E289", "#51C0BF", "#59ADD0", "#7095E1", "#9FA3E3", "#C993D4", "#DB8DB2"];

let visited1 = [];
let visited2 = [];

for(let i = 0 ; i < colors.length ; i++){
	visited1.push(false);
}

let cardColors1 = [];
let cardColors2 = [];

function makeColorsForTargets(){
	
	for(let i = 0 ; i < target.cards.length ; i++){
		let randNum = Math.floor(Math.random() * colors.length);
		
		if(!visited1[randNum]){
			cardColors1.push(colors[randNum]);
			
			visited2.push(false);
			visited1[randNum] = true
		}
		else i--;
	}
	
	
	for(let i = 0 ; i < target.cards.length ; i++){
		let randNum = Math.floor(Math.random() * cardColors1.length);
	
		if(!visited2[randNum]){
			cardColors2.push(cardColors1[randNum]);
			visited2[randNum] = true
		}
		else i--;
	}

}



export { makeColorsForTargets, cardColors1, cardColors2 };