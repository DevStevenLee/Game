import * as target from "./Targets.js";
import * as fadeCard from "./FadeCard.js";
import * as firework from "./FireworkEffect.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


let isTheArrowShot = false;
let isTheArrowCollided = false;

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

        this.offset = {
            centerX : this.centerX,
            centerY : this.centerY,
            toX : this.toX,
            toY : this.toY
        };

        this.velocityX = this.setVelocityX();
        this.velocityY = this.setVelocityY();

        this.arrowHeadSize = arrowHeadSize;
        this.slope = (this.toY - this.centerY) / (this.toX - this.centerX);
    }

    init(){
        this.centerX = this.offset.centerX;
        this.centerY = this.offset.centerY;
        this.toX = this.offset.toX;
        this.toY = this.offset.toY;
    }

    setVelocityX(){
        let dx = this.toX - this.centerX;
        let dy = this.toY - this.centerY;

        let mag = Math.sqrt(dx * dx + dy * dy);

        return (dx / mag) * arrowMoveSpeed;
    }

    setVelocityY(){
        let dx = this.toX - this.centerX;
        let dy = this.toY - this.centerY;

        let mag = Math.sqrt(dx * dx + dy * dy);

        return (dy / mag) * arrowMoveSpeed;
    }

    drawArrow(){
        let dx = this.toX - this.centerX;
        let dy = this.toY - this.centerY;

        let angle = Math.atan2(dy, dx);

        c.beginPath();

        c.lineWidth = 3;

        c.moveTo(this.centerX, this.centerY);
        c.lineTo(this.toX, this.toY);
        c.lineTo(this.toX - this.arrowHeadSize * Math.cos(angle - Math.PI / 5), this.toY - this.arrowHeadSize * Math.sin(angle - Math.PI / 5));

        c.moveTo(this.toX, this.toY);
    
        c.lineTo(this.toX - this.arrowHeadSize * Math.cos(angle + Math.PI / 5), this.toY - this.arrowHeadSize * Math.sin(angle + Math.PI / 5));
        
        c.closePath();
        c.stroke();
        
        c.lineWidth = 1;

        c.closePath();
    }

    isTheArrowOutOfTheMap(){
        if(this.centerX <= -20 || this.centerX >= canvas.width || this.centerY <= -20 || this.centerY >= canvas.height)
            return true;

        return false;
    }
    
    isTheArrowCollidedWithTargets(){
        for(let i = 0 ; i < target.cards.length ; i++){
            if( arrows[arrowIdx].toX > target.cards[i].x && 
                arrows[arrowIdx].toX < target.cards[i].x + target.cards[i].width &&
                arrows[arrowIdx].toY > target.cards[i].y && 
                arrows[arrowIdx].toY < target.cards[i].y + target.cards[i].height){
                
                if(target.cards[i].color == fadeCard.fadeCards[0].color){
                    isTheArrowCollided = true;
                
                    firework.init({x: (target.cards[i].x + target.cards[i].x + target.cards[i].width) / 2, 
                                   y : (target.cards[i].y + target.cards[i].y + target.cards[i].height) / 2});
                
                
                    target.cards.splice(i, 1);
                    fadeCard.fadeCards.splice(0, 1);
                }
                
                return true;
            }
        }
        
        return false;
    }
 
}

function toRadians(degree){
    return degree * (Math.PI / 180);
}

let arrows;

function init(){
    arrows = [];

    
    let radius = 120;
    let centerX = canvas.width / 2;
    let centerY = canvas.height - 10;
    let arrowHeadSize = 20;
    let speed = 1;

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
let arrowMoveSpeed = 8;
function animation(){
    if(arrowIdx >= arrows.length - 1)
        arrowIdx = 0;

    if(isTheArrowCollided){
        firework.animation();
            
        if(firework.particles.length < 1)
            isTheArrowCollided = false;
    }
    
    if(!isTheArrowShot){
        arrows[arrowIdx].drawArrow(arrows[arrowIdx].centerX, arrows[arrowIdx].centerY, arrows[arrowIdx].toX, arrows[arrowIdx].toY);
        arrowIdx++;
    }
    
    else{   
        arrows[arrowIdx].centerX+=arrows[arrowIdx].velocityX;
        arrows[arrowIdx].centerY+=arrows[arrowIdx].velocityY;
        arrows[arrowIdx].toX+=arrows[arrowIdx].velocityX;
        arrows[arrowIdx].toY+=arrows[arrowIdx].velocityY;
        
        if(arrows[arrowIdx].isTheArrowCollidedWithTargets() || arrows[arrowIdx].isTheArrowOutOfTheMap()){
            arrows[arrowIdx].init();
            isTheArrowShot = false;
        }

        arrows[arrowIdx].drawArrow();
    }
}


export { init, animation, isTheArrowCollided};