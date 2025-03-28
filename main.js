let pillars = [];
let players = [];

class NeuralNetwork {
    constructor(weights, bias=0) {
        this.mutation_frequency = 0.5;
        this.mutation_strength = 0.05;
        this.weights = weights;
        this.bias = bias;
    }

    forward() {
        let summed_weights = 0;
        let inputs = [this.getFloorDistance(), this.getDistanceTopPipe(), this.getDistanceBottomPipe(), this.getDistanceToClosestPillar(), this.vely];
        for(let i = 0; i < this.weights.length; i++)  {
            summed_weights += this.weights[i]*inputs[i];
        }
        let sigmoid = 1 / (1 + Math.exp(summed_weights - this.bias));
        return sigmoid;
    }

    mutate() {
        if (Math.random() > this.mutation_frequency) return;
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] += gaussianRandom(0, this.mutation_strength);
            this.bias += gaussianRandom(0, this.mutation_strength);
        }
    }
}

class Bird extends NeuralNetwork {
    constructor(weights) {
        super(weights);
        this.y = canvas.height/2;
        this.x = canvas.width/3;
        this.vely = 0;
        this.timeAlive = 0;
        this.timeStart = time_now;
        this.height = 45;
        this.color = "#fff";
        this.isDead=false;
    }

    draw() {
        drawRect(this.x, this.y, this.height, this.height, BG_COLOR, false);
        drawRect(this.x, this.y, this.height, this.height, this.color, true);
    }

    update() {
        if (!this.isDead && (this.isColliding() || this.y + this.height >= canvas.height)) {
            players_dead++;
            this.isDead = true;
        }
        this.vely += 0.002*delta_time;
        this.y += this.vely*delta_time;
        this.y = Math.max(0, Math.min(canvas.height-this.height, this.y));
        if(this.isDead) return;
        if(this.forward() > 0.5) this.flap();
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

    getFloorDistance() {
        return canvas.height - (this.y + this.height);
    }

    getClosestPillar() {
        let closestPillar = null;
        let minDistance = Infinity;
    
        for (let i = 0; i < pillars.length; i++) {
            let distance = pillars[i].x - this.x;
            if (distance > 0 && distance < minDistance) {
                minDistance = distance;
                closestPillar = pillars[i];
            }
        }
    
        return closestPillar;
    }
    
    getDistanceToClosestPillar() {
        let closestPillar = this.getClosestPillar();
        return closestPillar ? closestPillar.x - this.x : Infinity;
    }
    
    getDistanceTopPipe() {
        let closestPillar = this.getClosestPillar();
        return closestPillar ? this.y - closestPillar.top_height : Infinity;
    }
    
    getDistanceBottomPipe() {
        let closestPillar = this.getClosestPillar();
        return closestPillar ? (canvas.height - closestPillar.bottom_height) - (this.y + this.height) : Infinity;
    }

    flap() {
        if(this.isDead) return;
        this.vely = -0.55;
    }
}

class Pillar {
    constructor(initalx=canvas.width) {
        this.speed = 0.146;
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
        this.x -= this.speed*delta_time;
        if(this.x <= canvas.width/3+50  && !this.passed_player) {
            pillars.push(new Pillar());
            this.passed_player = true;
        }
        else if(this.passed_player && this.x <= -this.width) {
            pillars = pillars.filter(p => p !== this);
        }
    }
}

function getTopBirds(n) {
    return players
        .sort((a, b) => b.timeAlive - a.timeAlive) // Sort in descending order
        .slice(0, n); // Get the top `n` birds
}

function next_generation() {
    let best = 5;
    let best_players = getTopBirds(best);
    reset_game();
    for (let i = 0; i < max_players / best_players.length; i++) {
        for (let j = 0; j < best_players.length; j++) {
            players.push(new Bird([...best_players[j].weights]));
        }
    }
    for(let i = 0; i < players.length; i++) {
        if(players[i].isDead) console.log("NO");
        players[i].mutate();
        players[i].isDead = false;

    }
    // console.log(players[0]);
}

function reset_game() {
    players.length = 0;
    players_dead = 0;
    pillars.length = 0;
    pillars.push(new Pillar(2 * canvas.width)); 
}

function draw_players_alive() {
    drawText(`${max_players-players_dead} alive`, 0, 20, 20, "white");
}
let players_dead = 0;
let time_now = 0;
let time_last = 0;
let delta_time = 0;
const max_players = 10000;
reset_game();
for(let i = 0; i < max_players; i++) {
    players.push(new Bird([0, 0, 0, 0, 0]));
}
const BG_COLOR = "#272b30";
let paused = false;
function loop(time) {
    // console.log(paused);
    if(paused) return requestAnimationFrame(loop);
    time_now = time;
    delta_time = time_now-time_last;
    time_last = time_now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0, 0, canvas.width, canvas.height, BG_COLOR);
    
    for (let i = 0; i < pillars.length; i++) {
        pillars[i].update();
        pillars[i].draw();        
    }
    for (let i = 0; i < players.length; i++) {
        if(players[i].isDead) continue;
        players[i].update();
        players[i].draw();        
    }

    draw_players_alive();

    if(players_dead == max_players) {
        console.log("next gen");
        next_generation();
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// document.addEventListener('keydown', e => {
//     if(e.repeat) return;
//     players[0].flap();
// });

// document.addEventListener("pointerdown", e => {
//     if(e.repeat) return;
//     players[0].flap();
// });

document.addEventListener("focus", e => {
    paused = false;
    time_last = performance.now();
});
document.addEventListener("blur", e => {
    paused = true;
    // console.log("focus out");
});