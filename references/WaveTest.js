function drawCircle(ctx, mW, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    
    ctx.arc(mW / 2, mW / 2, mW / 2 - 1, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mW / 2, mW / 2, mW / 2 - 2, 0, 2 * Math.PI);
    ctx.clip();
}

function drawSin(ctx, mW, color1, color2, wav, dY) {
    ctx.beginPath();

    ctx.moveTo(0, mW);
    ctx.lineTo(0, dY);

    ctx.quadraticCurveTo(mW / 4, dY - wav, mW / 2, dY);
    ctx.quadraticCurveTo((mW * 3) / 4, dY + wav, mW, dY);

    ctx.lineTo(mW, mW);
    ctx.lineTo(0, mW);

    ctx.fillStyle = color1;

    ctx.fill();
}

function init() {
    var canvas1 = document.getElementById('canvas')

    var mW = canvas1.clientWidth;
    canvas1.style.height = mW;
    canvas1.width = canvas1.height = mW;

    var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');
    canvas2.width = mW;
    canvas2.height = mW;

    var x = 0, flat = 300, speed = 7, rate = 0.7, distance = 180, wave = 50

    var ctx1 = canvas1.getContext('2d')

    drawCircle(ctx1, mW, '#1a4768');
    drawSin(ctx2, mW, '#1c86d1', '#1c86d1', wave, mW - mW * rate);

    function animation() {
    	ctx1.clearRect(0, 0, mW, mW)
        
        ctx1.drawImage(canvas2, x, 0, mW + flat, mW);
        ctx1.drawImage(canvas2, x - mW - flat, 0, mW + flat, mW);
        
        x >= (mW - speed + flat) ? x = 0 : x += speed
        
        requestAnimationFrame(animation)
    }

    animation();
}

init();