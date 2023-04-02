import blocks from "./blcoks.js"

// DOM
const $tetrisWrapper = document.querySelector('#tetris-wrapper > ul');
const $gameover = document.querySelector('#gameover');
const $score = document.querySelector('#score');
const $restart = document.querySelector('#regame');

// Setting
const rows = 20;
const cols = 10

// 변수
let score = 0;
let duration = 500; // 블락이 떨어지는 시간
let downInterval;
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

init();

// 시작 함수
function init() {
    tempMovingItem = { ...MovingItem };

    // tetris 그려줌
    for (let i = 0; i < rows; i++) {
        prependNewline();
    }

    generateNewBlock();
}

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

// block renderfing
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
            if(moveType==="retry"){
                clearInterval(downInterval);
                showGameOver();
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

function showGameOver(){
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
            $score.innerHTML = score;
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
$restart.addEventListener('click', ()=>{
    $tetrisWrapper.innerHTML="";
    $gameover.style.display='none';
    init();
})