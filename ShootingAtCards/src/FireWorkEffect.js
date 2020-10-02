
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

function Particle(pos) {
    this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
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
}

Particle.prototype.update = function() {
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

Particle.prototype.render = function() {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
    y = this.pos.y,
    r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
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

Particle.prototype.exists = function() {
    return this.alpha >= 0.1 && this.size >= 1;
}

function Rocket() {
    Particle.apply(
        this,
        [{
            x: Math.random() * canvas.width * 2 / 3 + canvas.width / 6,
            y: canvas.height
        }]
    );

    this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
    this.vel.y = Math.random() * -3 - 4;
    this.vel.x = Math.random() * 6 - 3;
    this.size = 2;
    this.shrink = 0.999;
    this.gravity = 0.01;
}

Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;

Rocket.prototype.explode = function() {
    var count = Math.random() * 10 + 80;

    for (var i = 0; i < count; i++) {
        var particle = new Particle(this.pos);
        var angle = Math.random() * Math.PI * 2;

        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

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

Rocket.prototype.render = function() {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
    y = this.pos.y,
    r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
    gradient.addColorStop(0.2, "rgba(255, 180, 0, " + this.alpha + ")");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
}

let rockets;
let particles;

function init(){
    rockets = [];
    particles = [];

    rockets.push(new Rocket());
}

function animation(){
    requestAnimationFrame(animation);

    c.clearRect(0, 0, canvas.width, canvas.height);

    let existingRockets = [];

    rockets.forEach(rocket => {
        rocket.update();
        rocket.render();

        let randomChance = rocket.pos.y < (canvas.height * 2 / 3) ? (Math.random() * 100 <= 1) : false;
    
        if (rocket.pos.y < canvas.height / 5 || rocket.vel.y >= 0 || randomChance) {
            rocket.explode();
        } 
        else {
            existingRockets.push(rocket);
        }
    });

    rockets = existingRockets;

    let existingParticles = [];
    particles.forEach(particle => {
        particle.update();

            // render and save particles that can be rendered
        if (particle.exists()) {
            particle.render();
            existingParticles.push(particle);
        }
    });

    particles = existingParticles;
}

init();
animation();