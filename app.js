window.onload = () => {
    document.addEventListener('keydown', changeDirection);
    setInterval(loop, 1000 / 60);
}

let
    canv = document.getElementById('mc'),
    ctx = canv.getContext('2d'),
    gs = fkp = false,
    speed = baseSpeed = 3,
    xv = yv = 0,
    px = ~~(canv.width) / 2,
    py = ~~(canv.height) / 2,
    pw = ph = 20,
    aw = ah = 20,
    apples = [],
    trail = [],
    tail = 100,
    tailSafeZone = 20,
    cooldown = false,
    score = 0;

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canv.width, canv.height);

    px += xv;
    py += yv;

    if (px > canv.width) { px = 0; }

    if (px + pw < 0) { px = canv.width; }

    if (py + ph < 0) { py = canv.height; }

    if (py > canv.height) { py = 0; }

    ctx.fillStyle = 'lime';
    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = trail[i].color || 'lime';
        ctx.fillRect(trail[i].x, trail[i].y, pw, ph);
    }

    trail.push({ x: px, y: py, color: ctx.fillStyle });

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length >= tail && gs) {
        for (let i = trail.length - tailSafeZone; i >= 0; i--) {
            if (
                px < (trail[i].x + pw)
                && px + pw > trail[i].x
                && py < (trail[i].y + ph)
                && py + ph > trail[i].y
            ) {
                tail = 10;
                speed = baseSpeed;

                for (let t = 0; t < trail.length; t++) {
                    trail[t].color = 'red';

                    if (t >= trail.length - tail) { break; }
                }
            }
        }
    }

    for (let a = 0; a < apples.length; a++) {
        ctx.fillStyle = apples[a].color;
        ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
    }

    for (let a = 0; a < apples.length; a++) {
        if (
            px < (apples[a].x + pw)
            && px + pw > apples[a].x
            && py < (apples[a].y + ph)
            && py + ph > apples[a].y
        ) {
            apples.splice(a, 1);
            tail += 10;
            speed += .1;
            spawnApple();
            break;
        }
    }
}

function spawnApple() {
    let
        newApple = {
            x: ~~(Math.random() * canv.width),
            y: ~~(Math.random() * canv.height),
            color: 'red'
        };
    if (
        (newApple.x < aw || newApple.x > canv.width - aw)
        ||
        (newApple.y < ah || newApple.y > canv.height - ah)
    ) {
        spawnApple();
        return;
    }

    for (let i = 0; i < tail.length; i++) {
        if (
            newApple.x < (trail[i].x + pw)
            && newApple.x + aw > trail[i].x
            && newApple.y < (trail[i].y + ph)
            && newApple.y + ah > trail[i].y
        ) {
            spawnApple();
            return;
        }
    }

    apples.push(newApple);

    if (apples.length < 3 && ~~(Math.random() * 1000) > 700) {
        spawnApple();
    }
}

function rc() {
    return '#' + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16));
}

function changeDirection(evt) {
    if (!fkp && [65, 87, 68, 83].indexOf(evt.keyCode) > -1) {
        setTimeout(() => { gs = true; }, 1000);
        fkp = true;
        spawnApple();
    }

    if (cooldown) { return false; }

    if (evt.keyCode == 65 && !(xv > 0)) { xv = -speed; yv = 0; }

    if (evt.keyCode == 87 && !(yv > 0)) { xv = 0; yv = -speed; }

    if (evt.keyCode == 68 && !(xv < 0)) { xv = speed; yv = 0; }

    if (evt.keyCode == 83 && !(yv < 0)) { xv = 0; yv = speed; }

    cooldown = true;
    setTimeout(() => { cooldown = false; }, 100);
}