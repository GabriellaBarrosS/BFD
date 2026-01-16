
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let dir = { x: 1, y: 0 };       
let nextDir = { x: 1, y: 0 };  
let food = { x: 0, y: 0 };  // posição da comida boa
let badFruit = { x: -1, y: -1 };     // posição da comida mal
let score = 0;
let speed = 120;                
let gameInterval = null;
let running = false;


function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    for (let s of snake) {
        if (s.x === food.x && s.y === food.y) {
            //tenta de novo
            placeFood();
            return;
        }
    }
}

function placeBadFruit() {
    badFruit.x = Math.floor(Math.random() * tileCount);
    badFruit.y = Math.floor(Math.random() * tileCount);

    // Evita colocar sobre a cobra ou a comida comum
    for (let s of snake) {
        if ((s.x === badFruit.x && s.y === badFruit.y) ||
            (food.x === badFruit.x && food.y === badFruit.y)) {
            placeBadFruit(); // tenta novamente
            return;
        }
    }
}

function draw() {
    // fundo
    ctx.fillStyle = '#223810ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // comida
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 1, tileSize - 1);

    // comida ruim 
    ctx.fillStyle = '#e7f70dff'; // azul
    ctx.fillRect(badFruit.x * tileSize, badFruit.y * tileSize, tileSize - 1, tileSize - 1);

    // cobra
    ctx.fillStyle = '#27ae60';
    for (let i = 0; i < snake.length; i++) {
        const s = snake[i];
        ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize - 1, tileSize - 1);
    }
}

// atualiza estado do jogo (movimentação, colisões, comer)
function update() {
    // aplica próxima direção se não for reverso
    if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) {
        dir = nextDir;
    }

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // colisão com paredes -> fim de jogo
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // colisão com o próprio corpo
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            gameOver();
            return;
        }
    }

    //fruta ruim (diminui o rabo)
    if (head.x === badFruit.x && head.y === badFruit.y) {
        // tira 2 segmentos 
        for (let i = 0; i < 2; i++) {
            if (snake.length > 1) {
                snake.pop();
            }
        }
        placeBadFruit(); 
    }

    // move a cobra
    snake.unshift(head);

    // comeu?
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        placeFood();
    } else {
        snake.pop();
    }
}


function gameOver() {
    running = false;
    clearInterval(gameInterval);
    alert('Game Over! Pontuação: ' + score);
}

//controles
function start() {
    if (running) return;
    running = true;
    if (snake.length === 0) resetState();
    if (!food.x && !food.y) placeFood();
    gameInterval = setInterval(() => {
        update();
        draw();
    }, speed);
}

function pause() {
    if (!running) return;
    running = false;
    clearInterval(gameInterval);
}

function restart() {
    running = false;
    clearInterval(gameInterval);
    // estado inicial
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    document.getElementById('score').innerText = score;
    placeFood();
    placeBadFruit();
    draw();
}

// reset
function resetState() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    document.getElementById('score').innerText = score;
    placeFood();
}

//teclado 
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            nextDir = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            nextDir = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            nextDir = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            nextDir = { x: 1, y: 0 };
            break;
    }
});

//botões
document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('restart').addEventListener('click', restart);
document.getElementById('speed').addEventListener('change', (e) => {
    speed = parseInt(e.target.value, 10);
    if (running) {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            update();
            draw();
        }, speed);
    }
});

// inicializa
window.addEventListener('load', () => {
    placeFood();
    placeBadFruit(); 
    draw();
});