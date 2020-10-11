
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Particle{
    constructor(pos){
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.shrink = .97;
        this.size = 20;

        this.resistance = 1;
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        this.fade = 0;
        this.color = 0;

        this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
    }

    update(){
        // apply resistance
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down
        this.vel.y += this.gravity;

        // update position based on speed
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // shrink
        this.size *= this.shrink;

        // fade out
        this.alpha -= this.fade;
    }

    render(){
        if (!this.exists()) {
            return;
        }

        c.save();

        c.globalCompositeOperation = 'lighter';

        let x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

        let gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
        gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
        gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        c.restore();
    }

    explode(){
        let count = Math.random() * 10 + 80;

        for (var i = 0; i < count; i++) {
            let particle = new Particle(this.pos);
            let angle = Math.random() * Math.PI * 2;

            // emulate 3D effect by using cosine and put more particles in the middle
            let speed = Math.cos(Math.random() * Math.PI / 2) * 15;

            particle.vel.x = Math.cos(angle) * speed;
            particle.vel.y = Math.sin(angle) * speed;

            particle.size = 10;

            particle.gravity = 0.2;
            particle.resistance = 0.92;
            particle.shrink = Math.random() * 0.05 + 0.93;

            particle.flick = true;
            particle.color = this.explosionColor;

            particles.push(particle);
        }      
    }

	exists() {
    	return this.alpha >= 0.1 && this.size >= 1;
	}
	
}

let particle;
let particles;


function init(pos){
	
    particles = [];
    particle = new Particle(pos);
	
	particle.explode();
}

function animation(){ 
    let existingParticles = [];
	
	//console.log(particles);
    particles.forEach(particle => {
        particle.update();
		
        if (particle.exists()) {
            particle.render();
            existingParticles.push(particle);
        }
    });

	//console.log("test");
    particles = existingParticles;
} 


export { init, animation, particles };