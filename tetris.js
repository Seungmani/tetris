// import blocks from "./blcoks.js"

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

// export default blocks;

// Setting
const rows = 20;
const cols = 10

// 변수
let score = 0;
let duration = 500; // 블락이 떨어지는 시간
let downInterval;
let timeInterval;
let tempMovingItem; // 다음 아이템 임시 저장
const MovingItem = {
    // 다음 블락 정보, 좌표
    type: '',
    direction: 0,
    top: 0,
    left: 0,
};

// Function
//////////////////

window.onload = () => {
    tempMovingItem = { ...MovingItem };

    // tetris 그려줌
    for (let i = 0; i < rows; i++) {
        prependNewline();
    }
}

let startTime;
let start = false
// 시작 함수
function init() {
    if (!start) {
        start = true;
        generateNewBlock();
        startTime = new Date();
        timeInterval = setInterval(() => {
            const time = Math.floor((new Date() - startTime) / 1000);
            $time.textContent = `${time}초`;
            if (time % 60 === 0) {
                duration -= 50; // 1분마다 속도 증가
                console.log(duration);
            }
        }, 1000)
    } else {
        return;
    }
}

// 그림그려줌
function prependNewline() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for (let j = 0; j < cols; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul)
    $tetrisWrapper.prepend(li);
}

// block rendering
function renderBlocks(moveType = "") {

    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach((moving) => {
        moving.classList.remove(type, "moving") // 블럭을 이동하면 전 블럭이 남아있음. class 제거를 통해 해결
    })

    // forEach는 break 불가
    blocks[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = $tetrisWrapper.childNodes[y] ? $tetrisWrapper.childNodes[y].childNodes[0].childNodes[x] : null; // 좌표 알아오기
        const available = isEmpty(target); // 만약 블럭이 범위를 벗어나거나 주변에 블럭이 있어서 이동불가늘 한지 판단
        if (available) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = { ...MovingItem };
            if (moveType === "retry") {
                clearInterval(downInterval);
                clearInterval(timeInterval);
                showGameOver();

                if(parseInt($time.textContent) <60){
                    $finalTime.textContent = ` ${$time.textContent}초`;
                } else{
                    $finalTime.textContent = `${parseInt(parseInt($time.textContent)/60)}분 ${parseInt($time.textContent)%60}초`;
                }
                $finalScore.textContent = `${($score.textContent * (parseInt(parseInt($time.textContent)/60) + 1))}점`;
            }
            setTimeout(() => { // call stack over 방지
                renderBlocks('retry');
                if (moveType === 'top') {
                    seizeBlock()// 맨 밑이면 블락 고정
                }
            }, 0)
            return true;
        }
    });
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;

}

function showGameOver() {
    $gameover.style.display = 'flex';
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach((moving) => {
        moving.classList.remove("moving")
        moving.classList.add("seized")
    })
    checkMatch();
}

function checkMatch() {
    let count = 0;
    const childnode = $tetrisWrapper.childNodes;
    childnode.forEach((child) => {
        let match = true;
        child.children[0].childNodes.forEach((li) => {
            if (!li.classList.contains('seized')) {
                // 만약 줄이 꽉 차면 모든 li가 seized 클래스를 가진다
                match = false;
            }
        })
        if (match) {
            child.remove();
            prependNewline();
            score++;
            count++;
            $score.innerHTML = score * count;
        }
    })

    generateNewBlock();
}

function generateNewBlock() {

    clearInterval(downInterval);
    // block 자동으로 내려옴
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, duration)

    const blocksArray = Object.entries(blocks);
    const ramdomIndex = Math.floor(Math.random() * blocksArray.length);
    MovingItem.type = blocksArray[ramdomIndex][0];
    MovingItem.top = 0;
    MovingItem.left = 3; // 가운데에서 떨어지게
    MovingItem.direction = 0;
    tempMovingItem = { ...MovingItem };
    renderBlocks;
}

// 만약 블럭이 범위를 벗어나거나 주변에 블럭이 있어서 이동불가능 한지 판단
function isEmpty(target) {
    if (!target || target.classList.contains('seized')) return false;
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function chageDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10)
}

// event handling
//////////////////////

$start.addEventListener('click', () => {
    init();
})


let stop = false;
$stop.addEventListener('click', () => {
    if (!stop) {
        stop = true;
        clearInterval(downInterval);
        clearInterval(timeInterval);
        $stop.innerHTML = "CONTINUE";
    } else {
        stop = false;
        $stop.innerHTML = "STOP";
        downInterval = setInterval(() => {
            moveBlock("top", 1)
        }, duration)
        timeInterval = setInterval(() => {
            const time = Math.floor((new Date() - startTime) / 1000);
            $time.textContent = `${time}초`;
        }, 1000)
    }
})

// 키다운 이벤트
document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 39: // 우측이돈
            moveBlock("left", 1);
            break;
        case 37: // 좌측이동
            moveBlock("left", -1);
            break;
        case 40: // 아래로 이동
            moveBlock("top", 1);
            break;

        case 38: // 윗 방향키를 누르면 방향을 전환
            chageDirection();
            break;
        case 32: // spcaebar
            dropBlock();
            break;
        default:
            break;
    }
})

// 다시시작
$restart.addEventListener('click', () => {
    window.location.href = window.location.href; // 페이지 리로드
})