let pillars = [];
class Bird {
    constructor(weights) {
        this.weights = weights;
        this.y = canvas.height/2;
        this.x = canvas.width/3;
        this.vely = 0;
        this.timeAlive = 0;
        this.timeStart = time_now;
        this.height = 50    ;
        this.color1 = "#d4bf27"
        this.color2 = "#dde2b1"
    }

    draw() {
        drawRect(this.x, this.y, this.height, this.height, this.color1);
        drawRect(this.x+3, this.y+3, this.height-6, this.height-6, this.color2);
    }

    update() {
        this.timeAlive = (time_now-this.timeStart)/1000;
        this.vely += 0.0015*delta_time;
        this.y += this.vely*delta_time;
        this.y = Math.max(0, Math.min(canvas.height-this.height, this.y))
    }

    isColliding() {
        for(let i = 0; i < pillars.length; i++) {
            if (
                this.x < pillars[i].x + pillars[i].width &&
                this.x + this.width > pillars[i].x &&
                (this.y < pillars[i].top || this.y + this.height > canvas.height - pillars[i].bottom)
            )
            return true;
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
        if(this.isColliding())
        player1.vely = -0.07*delta_time;
    }
}

class Pillar {
    constructor(initalx=canvas.width) {
        this.speed = 0.2;
        this.width = 100;
        this.x = initalx;
        this.gap_height = 195;
        this.bottom_height = Math.random() * (canvas.height - this.gap_height - 50);
        this.color = "green";
        this.passed_player = false;
    }

    draw() {
        drawRect(this.x, canvas.height-this.bottom_height, this.width, this.bottom_height, this.color);
        drawRect(this.x, 0, this.width, canvas.height-this.bottom_height-this.gap_height, this.color);
    }

    update() {
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

function displayBest() {
    drawText(`Best Score: ${player1.timeAlive.toFixed(1)}`, 5, 20, 20, "white");
}

function displayFPS() {
    drawText(`${(1000/delta_time).toFixed(0)} FPS`, 5, 40, 20, "white");
}

let time_now = 0;
let time_last = 0;
let delta_time = 0;
let player1 = new Bird();
pillars.push(new Pillar(2*canvas.width));
function loop(time) {
    time_now = time;
    delta_time = time_now-time_last;
    time_last = time_now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0, 0, canvas.width, canvas.height, "#70c5cd")

   
    player1.update();
    player1.draw();
    
    for (let i = 0; i < pillars.length; i++) {
        pillars[i].update();
        pillars[i].draw();        
    }

    displayFPS();
    displayBest(); 
    requestAnimationFrame(loop);
}

document.addEventListener('keypress', e => {
    if(e.repeat) return;
    player1.vely = -0.07*delta_time;
});

requestAnimationFrame(loop);