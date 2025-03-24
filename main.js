let pillars = [];
let players = [];
class Bird {
    constructor(weights) {
        this.weights = weights;
        this.y = canvas.height/2;
        this.x = canvas.width/3;
        this.vely = 0;
        this.timeAlive = 0;
        this.timeStart = time_now;
        this.height = 45;
        this.color = "#fff"
        this.isDead=false;
    }

    draw() {
        drawRect(this.x, this.y, this.height, this.height, BG_COLOR, false);
        drawRect(this.x, this.y, this.height, this.height, this.color, true);
    }

    update() {
        if (this.isColliding()) this.isDead = true;
        this.vely += 0.0015*delta_time;
        this.y += this.vely*delta_time;
        this.y = Math.max(0, Math.min(canvas.height-this.height, this.y))
        if(this.isDead) return;
        this.timeAlive = (time_now-this.timeStart)/1000;
    }

    isColliding() {
        for(let i = 0; i < pillars.length; i++) {
            if (
                this.x < pillars[i].x + pillars[i].width &&
                this.x + this.height > pillars[i].x &&
                (this.y < pillars[i].top_height || this.y + this.height > canvas.height - pillars[i].bottom_height)
            ){
            return true;
            }
        }
        return false;
    }

    getDistanceToClosestPillar() {
        let closestDistance = Infinity;
        for (let i = 0; i < pillars.length; i++) {
            let distance = pillars[i].x - this.x;
            if (distance > 0 && distance < closestDistance) {
                closestDistance = distance;
            }
        }
        return closestDistance;
    }

    flap() {
        if(this.isDead) return;
        this.vely = -0.5;
    }
}

class Pillar {
    constructor(initalx=canvas.width) {
        this.speed = 0.2;
        this.width = 100;
        this.x = initalx;
        this.gap_height = 195;
        this.bottom_height = Math.random() * (canvas.height - this.gap_height - 50);
        this.top_height = canvas.height-this.bottom_height-this.gap_height;
        this.color = "#fff";
        this.passed_player = false;
    }

    draw() {
        drawRect(this.x, canvas.height-this.bottom_height, this.width, this.bottom_height+5, this.color, true);
        drawRect(this.x, -5, this.width, this.top_height+5, this.color, true);
    }

    update() {
        if(players[0].isDead) return;
        this.x -= this.speed*delta_time;
        if(this.x <= canvas.width/3+50  && !this.passed_player) {
            pillars.push(new Pillar());
            this.passed_player = true
        }
        else if(this.passed_player && this.x <= -this.width) {
            pillars.splice(0,1);
            delete this;
        }
    }
}

let time_now = 0;
let time_last = 0;
let delta_time = 0;
players.push(new Bird());
pillars.push(new Pillar(2*canvas.width));
const BG_COLOR = "#272b30";
function loop(time) {
    time_now = time;
    delta_time = time_now-time_last;
    time_last = time_now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0, 0, canvas.width, canvas.height, BG_COLOR);
    
    for (let i = 0; i < pillars.length; i++) {
        pillars[i].update();
        pillars[i].draw();        
    }

    players[0].update();
    players[0].draw();

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

document.addEventListener('keydown', e => {
    if(e.repeat) return;
    players[0].flap();
});

document.addEventListener("pointerdown", e => {
    if(e.repeat) return;
    players[0].flap();
});