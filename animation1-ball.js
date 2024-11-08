let canvas;
let cc;
let r=20;   //半径
let interval=0.01;  //描画間隔:10ms 
let timer;  //タイマIDを格納する変数
let x=100;  //x座標
let y=100;  //y座標
let dx=1.0; //x方向の移動量 
let dy=1.0; //y方向の移動量
                                 

function draw(){
    //canvasのクリア
    cc.clearRect(0, 0, canvas.width, canvas.height); drawCircle(x,y);
    updateCoordinate();
}

function updateCoordinate() {
    x = x + dx;
    y = y + dy;
}

function drawCircle(x, y) {
    cc.save();
    cc.beginPath();
    cc.arc(x, y, r, 0, Math.PI*2, true); 
    cc.closePath();
    cc.fill();
    cc.restore();
}

function init(){
    canvas = document.getElementById("canvas"); 
    cc = canvas.getContext("2d"); //描画関数を一定間隔で繰り返し呼び出す
    timer = setInterval(draw, interval * 1000);
}

// 初期化呼び出し 
init();