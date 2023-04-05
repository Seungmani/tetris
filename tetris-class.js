// DOM
const $tetrisWrapper = document.querySelector('#tetris-wrapper > ul');
const $gameover = document.querySelector('#gameover');
const $score = document.querySelector('#score');
const $finalScore = document.querySelector('#final-score');
const $finalTime = document.querySelector('#final-time');
const $time = document.querySelector('#time');
const $restart = document.querySelector('#regame');
const $start = document.querySelector("#start-btn");
const $stop = document.querySelector("#stop-btn");
const $nextBlock = document.querySelector('#nextblock >ul');
const blocks = {
    sqaure: [
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
    ],
    bar: [
        [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
        ],
        [
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2],
        ],
        [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
        ],
        [
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2],
        ],
    ],
    tree: [
        [
            [1, 0],
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [2, 1],
            [1, 2],
            [1, 1],
            [1, 0],
        ],
        [
            [2, 1],
            [0, 1],
            [1, 1],
            [1, 2],
        ],
        [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 2],
        ],
    ],
    zee: [
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 1],
            [1, 0],
            [1, 1],
            [0, 2],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
            [2, 0],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 2],
        ],
    ],
    elLeft: [
        [
            [0, 2],
            [1, 0],
            [1, 1],
            [1, 2],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 2],
            [2, 0],
        ],
        [
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
        ],
    ],
    elRight: [
        [
            [1, 2],
            [0, 0],
            [0, 1],
            [0, 2],
        ],
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [2, 0],
        ],
        [
            [0, 0],
            [1, 1],
            [1, 2],
            [1, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [2, 1],
            [2, 0],
        ],
    ],
}

// Setting
const rows = 20;
const cols = 10
const next_rows = 5;
const next_cols = 5;

function tetris() {
    // 변수
    this.score = 0;
    this.duration = 500; // 블락이 떨어지는 시간
    this.downInterval;
    this.timeInterval;
    this.tempMovingItem; // 다음 아이템 임시 저장
    this.startTime;
    this.MovingItem = {
        // 다음 블락 정보, 좌표
        type: '',
        direction: 0,
        top: 0,
        left: 0,
    };

    this.init = () => {

        this.duration = 500;
        this.score = 0;
        createTetrisGrid($tetrisWrapper, rows);
        createNextTetrisGrid($nextBlock, next_rows);
        generateNewBlock(selectBlock());
        
        this.startTime = new Date();
        this.timeInterval = setInterval(() => {
            const time = Math.floor((new Date() - startTime) / 1000);
            $time.textContent = `${time}초`;
        }, 1000)

        this.AccelationInterval = setInterval(() => {
            this.duration -= 100;
        }, 60000);
    };

    const createTetrisGrid = (grid, rows) => {
        for (let i = 0; i < rows; i++) {
            prependNewline(grid, rows);
        }
    };
    const createNextTetrisGrid = (grid, next_rows) => {
        for (let i = 0; i < next_rows; i++) {
            prependNewLine(grid, next_rows);
        }
    };

    const prependNewLine = (grid, column) => {
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        for (let j = 0; j < column; j++) {
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul);
        grid.prepend(li);
    };
}


$start.addEventListener("click", () => {
    const tetris = new tetris();
    tetris.init();
});