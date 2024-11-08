let canvas;
let cc;
let r=20;   //半径
let interval=0.01;  //描画間隔:10ms 
let timer;  //タイマIDを格納する変数
let x=100;  //x座標
let y=100;  //y座標
let dx=1.0; //x方向の移動量 
let dy=1.0; //y方向の移動量
let g = 3.0; //重力加速度 px/s^2 
let e = 0.6; //壁の反発係数
let count = 0; //クリックカウント
let drag = false; //マウスでドラッグ中を判定するフラグ
let reflectCount = 0; //反射した回数のカウント 
let gameTimer; //タイマーID
let gameTime = 10; //ゲーム時間10s
let countdown; //カウントダウン
                                 

function draw(){
    //canvasのクリア
    cc.clearRect(0, 0, canvas.width, canvas.height); 
    drawCircle(x,y);
    updateCoordinate();
}

function updateCoordinate() {
    if (drag) return; // ドラッグ中は自動で移動させない
    dy = dy + g * interval;//重力方向の移動量(速度)を更新
    if((x + dx > canvas.width - r) || (x + dx < r)) {
        dx = (dx * -1) * e; //ベクトルを逆方向へ変換(反射係数を加味) 
        reflectCount++;
        document.getElementById("info").innerHTML = reflectCount;
    }
    if((y + dy >canvas.height -r) || (y + dy < r)) {
        dy = (dy * -1) * e; //ベクトルを逆方向へ変換(反射係数を加味)
        reflectCount++;
        document.getElementById("info").innerHTML = reflectCount;
    }
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

// ボールがクリックされたかの判例処理 
function clickCircle(mx, my) {
// クリックした座標と、◯の現在位置(中心座標)との距離を計算
let distance = Math.sqrt(
    Math.pow(mx - x, 2) + Math.pow(my - y, 2));
    // 距離がボールの半径以下かどうか 
    if(distance <= r)return true;
    return false; 
}

function onMouseClick(e) {
    //クリックされた座標取得
    const rect = canvas.getBoundingClientRect(); // Canvasの位置を取得 
    let mx = e.clientX - rect.left; // クリックされたX座標
    let my = e.clientY - rect.top; // クリックされたY座標
    if(clickCircle(mx, my)) { // ボールをクリックできたかを判定 
        // クリックされたカウントをインクリメント
        count++;
        // クリックのカウントを画面表示 
        document.getElementById("count").innerHTML = count;
    } 
}

function onMouseMove(e) { //指定された要素の上をマウスが移動している間実行される
    if(!drag) return; //ドラッグ中でなければ以降の処理はしない
    //今現在のマウスの座標
    const rect = canvas.getBoundingClientRect(); // Canvasの位置を取得
    let mx = e.clientX - rect.left; 
    let my = e.clientY - rect.top;
    //移動量の更新 
    dx = mx - x; 
    dy = my - y; 
    x = mx;
    y = my;
}

function onMouseDown(e) { //マウスクリック(押し込んだ時)
    //クリックされた座標取得
    const rect = canvas.getBoundingClientRect(); // Canvasの位置を取得 
    let mx = e.clientX - rect.left; // クリックされたX座標 
    let my = e.clientY - rect.top; // クリックされたY座標
    if(clickCircle(mx,my)) {
        drag = true; // ドラッグされている状態に変更 
        x = mx; // ボールの座標を更新
        y = my;
        dx = 0; // 移動量は0でリセット
        dy = 0;
    } 
}

function onMouseUp(e) { //マウスクリック(クリック状態から離したとき) 
    drag=false;
}

function onMouseOut(e) {
    //指定された要素からマウスカーソルが離れた時
    drag=false;
}

function gameOver(){
    //アニメーションの停止
    clearInterval(timer);
    //マウス操作イベントも停止 
    canvas.removeEventListener("mousemove", onMouseMove); 
    canvas.removeEventListener("mousedown", onMouseDown); 
    canvas.removeEventListener("mouseup", onMouseUp); 
    canvas.removeEventListener("mouseout", onMouseOut); //得点のハイライト表示 
    document.getElementById("info").style.color = "red";
}

function drawGrid(){ 
    cc.save();
    cc.strokeStyle = "black";
    cc.lineWidth = 0.5;
    for(let i = 0; i < canvas.width; i += 20) {
        cc.beginPath();
        cc.moveTo(i, 0);
        cc.lineTo(i, canvas.height);
        cc.closePath();
        cc.stroke();
    }
    for(let i = 0; i < canvas.height; i += 20) {
        cc.beginPath();
        cc.moveTo(0, i);
        cc.lineTo(canvas.width, i);
        cc.closePath();
        cc.stroke();
    }
    cc.restore();
}


function init(){
    document.getElementById("countdown").innerHTML = gameTime;
    canvas = document.getElementById("canvas"); 
    cc = canvas.getContext("2d"); //描画関数を一定間隔で繰り返し呼び出す
    timer = setInterval(draw, interval * 1000);
    gameTimer = setTimeout(gameOver, gameTime * 1000);
    gameTime -= 1;
    countdown = setInterval(function(){
        if(gameTime < 0)return;
        document.getElementById("countdown").innerHTML = gameTime;
        gameTime--;
    }, 1000);
}

function main(){
    // 初期化呼び出し
    init();
    // イベント設定
    // canvas.addEventListener('click', onMouseClick);
    canvas.addEventListener("mousemove", onMouseMove); 
    canvas.addEventListener("mousedown", onMouseDown); 
    canvas.addEventListener("mouseup", onMouseUp); 
    canvas.addEventListener("mouseout", onMouseOut);
    document.getElementById("start").addEventListener("click", init);
}

main();