const game = document.getElementById("GameLayer");
const board = document.getElementById("Board");
const scoreText = document.getElementById("Score");
const box = document.getElementById("Box");
const boxBase = document.getElementById("BoxBase");
const boxFrame = document.getElementById("BoxFrame");
const boxSide = document.getElementById("BoxSide");

document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const GRID_SIZE = 58;
const SIDE_SIZE = 8;

const GRID_COLS = 13;
const GRID_ROWS = 15;

const BOX_SIZE = 7

game.style.width = `${GAME_WIDTH}px`;
game.style.height = `${GAME_HEIGHT}px`;

board.style.width = `${(GRID_COLS + 1) * GRID_SIZE}px`;
board.style.height = `${(GRID_ROWS + 1) * (GRID_SIZE + SIDE_SIZE)}px`;

box.style.width = `${BOX_SIZE * GRID_SIZE * 2}px`;
box.style.height = `${(GRID_SIZE + SIDE_SIZE) * 2}px`

boxBase.style.width = `${BOX_SIZE * GRID_SIZE * 2 + 40}px`;
boxBase.style.height = `${(GRID_SIZE + SIDE_SIZE) * 2 + 40}px`

boxFrame.style.width = `${BOX_SIZE * GRID_SIZE * 2 + 30}px`;
boxFrame.style.height = `${(GRID_SIZE + SIDE_SIZE) * 2 + 30}px`

boxSide.style.top = `${(GRID_SIZE + SIDE_SIZE) * 2 + 25}px`;
boxSide.style.width = `${BOX_SIZE * GRID_SIZE * 2 + 20}px`;

function resizeGame() {
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    game.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", resizeGame);
resizeGame();

let score = 0;

let isGameOver = false;

const TARGET_COUNT = 144;

const targets = [];
const boxTargets = [];

for (let i = 0; i < TARGET_COUNT; i++) {
    const target = document.createElement("div");
    target.className = "target"

    target.image = i % 12 + 1;
    target.gridX = Math.floor(Math.random() * GRID_COLS);
    target.gridY = Math.floor(Math.random() * GRID_ROWS);
    target.layer = i;
    target.visible = false;
    target.board = true;

    target.style.filter = "brightness(0.4)";

    const side = document.createElement("div");
    side.className = "side";
    side.style.top = `${SIDE_SIZE * 2}px`;
    side.style.width = `${GRID_SIZE * 2}px`;
    side.style.height = `${GRID_SIZE * 2}px`;
    target.appendChild(side);

    const front = document.createElement("img");
    front.src = `images/block_${String(target.image).padStart(2,"0")}.png`;
    front.className = "front";
    front.style.width = `${GRID_SIZE * 2}px`;
    front.style.height = `${GRID_SIZE * 2}px`;
    target.appendChild(front);

    const x = target.gridX * GRID_SIZE;
    const y = target.gridY * (GRID_SIZE + SIDE_SIZE);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    target.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        
        if (target.visible && target.board  && !isGameOver) {
            score++;
            scoreText.textContent = `${Math.floor(score / TARGET_COUNT * 100)}%`;

            target.board = false;
            checkVisible();

            box.appendChild(target);
            target.style.top = "0";

            addTarget(target);
            removeTarget();
            if (boxTargets.length >= BOX_SIZE) {
                isGameOver = true;
            }
        };
    });

    board.appendChild(target);

    targets.push(target);
};

function addTarget(t1) {
    let count = 0;
    for (const t2 of boxTargets) {
        if (t2.image >= t1.image) {
            break;
        }
        count++;
    }
    boxTargets.splice(count, 0, t1);
}

function removeTarget() {
    let count;
    let image;
    boxTargets.forEach((t, i) => {
        if (t.image === image) {
            count++
            if (count >= 3) {
                for (let j = i; j > i - 3; j--) {
                    boxTargets[j].remove();
                    boxTargets.splice(j, 1);
                }
                count = 0;
            }
        } else {
            image = t.image;
            count = 1;
        }
    });

    boxTargets.forEach((t, i) => {
        t.style.left = `${i * GRID_SIZE * 2}px`;
    });
}

function checkVisible() {
    targets.forEach((t1) => {
        let overlap = false;
        for (const t2 of targets) {
            if (!t2.board) {
                continue;
            } else if (t1.layer >= t2.layer) {
                continue;
            }
            const dx = Math.abs(t1.gridX - t2.gridX);
            const dy = Math.abs(t1.gridY - t2.gridY);
            if (dx < 2 && dy < 2) {
                overlap = true;
                break;
            }
        }
        if (!overlap) {
            t1.visible = true;
            t1.style.filter = "brightness(1.0)";
            if (t1.image === 10) {
                t1.style.filter = "brightness(3.0)";
            }
        }
    });
}

checkVisible();
