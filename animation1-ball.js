let canvas;
let cc;
let r = 20;   // 半径
let interval = 0.01;  // 描画間隔:10ms 
let timer;  // タイマIDを格納する変数
let x = 100;  // x座標
let y = 100;  // y座標
let dx = 1.0; // x方向の移動量 
let dy = 1.0; // y方向の移動量
let g = 0.2; // 重力加速度 px/s^2 
let e = 0.8; // 壁の反発係数
let reflectCount = 0; // 反射回数のカウント
let score = 0; // スコア
let drag = false; // マウスでドラッグ中を判定するフラグ
let gameTimer; // タイマーID
let gameTime = 30; // ゲーム時間30s
let countdown; // カウントダウン
let obstacles = []; // 障害物の配列
let lastCollisionTime = 0; // 最後の衝突時間
const collisionCooldown = 200; // ミリ秒単位でのクールダウン時間
let count = 0; // クリック回数

function draw() {
    // canvasのクリア
    cc.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(x, y);
    drawObstacles();
    updateCoordinate();
}

function updateCoordinate() {
    if (drag) return; // ドラッグ中は自動で移動させない

    dy += g; // 重力の影響を加える
    let currentTime = Date.now();
    let collided = false;

    if ((x + dx > canvas.width - r) || (x + dx < r)) {
        dx *= -e; // ベクトルを逆方向へ変換(反発係数を加味)
        collided = true;
    }
    if ((y + dy > canvas.height - r) || (y + dy < r)) {
        dy *= -e; // ベクトルを逆方向へ変換(反発係数を加味)
        collided = true;
    }

    if (collided && currentTime - lastCollisionTime > collisionCooldown) {
        reflectCount++;
        updateReflectCount();
        lastCollisionTime = currentTime;
    }

    x += dx;
    y += dy;

    // 障害物との衝突判定
    obstacles.forEach(obstacle => {
        if (x + r > obstacle.x && x - r < obstacle.x + obstacle.width &&
            y + r > obstacle.y && y - r < obstacle.y + obstacle.height) {
            dy *= -e;
            if (currentTime - lastCollisionTime > collisionCooldown) {
                reflectCount += 5;
                updateScore();
                lastCollisionTime = currentTime;
            }
        }
    });
}

function drawCircle(x, y) {
    cc.save();
    cc.beginPath();
    cc.arc(x, y, r, 0, Math.PI * 2, true);
    cc.closePath();
    cc.fillStyle = 'red';
    cc.fill();
    cc.restore();
}

// ボールがクリックされたかの判定処理 
function clickCircle(mx, my) {
    // クリックした座標と、◯の現在位置(中心座標)との距離を計算
    let distance = Math.sqrt(
        Math.pow(mx - x, 2) + Math.pow(my - y, 2));
    // 距離がボールの半径以下かどうか 
    return distance <= r;
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
        // document.getElementById("clickCount").innerHTML = count;
        // スコアも更新
        score += 5;
        updateScore();
    } 
}

function drawObstacles() {
    cc.fillStyle = 'blue';
    obstacles.forEach(obstacle => {
        cc.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 3; i++) {
        obstacles.push({
            x: Math.random() * (canvas.width - 50),
            y: 100 + i * 100,
            width: 50,
            height: 10
        });
    }
}

function updateReflectCount() {
    score = reflectCount;
    updateScore();
}

function updateScore() {
    document.getElementById("score").innerHTML = score;
}

function gameOver() {
    document.getElementById("score").style.color = "red";
    clearInterval(timer);
    clearInterval(countdown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mouseout", onMouseOut);
    canvas.removeEventListener("click", onMouseClick);
}

function onMouseMove(e) {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    dx = mx - x;
    dy = my - y;
    x = mx;
    y = my;
}

function onMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    if (Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2)) <= r) {
        drag = true;
        x = mx;
        y = my;
        dx = 0;
        dy = 0;
    }
}

function onMouseUp() {
    drag = false;
}

function onMouseOut() {
    drag = false;
}

function init() {
    document.getElementById("score").style.color = "black";
    canvas = document.getElementById("canvas");
    cc = canvas.getContext("2d");
    createObstacles();
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 1.0;
    dy = 1.0;
    reflectCount = 0;
    score = 0;
    lastCollisionTime = 0;
    count = 0;
    updateReflectCount();
    updateScore();
    // document.getElementById("clickCount").innerHTML = count;
    gameTime = 15;
    document.getElementById("timeLeft").innerHTML = gameTime;

    timer = setInterval(draw, interval * 1000);
    countdown = setInterval(function() {
        if (gameTime <= 0) {
            gameOver();
            return;
        }
        gameTime--;
        document.getElementById("timeLeft").innerHTML = gameTime;
    }, 1000);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseOut);
    canvas.addEventListener("click", onMouseClick);
    document.getElementById("start").addEventListener("click", init);
}

init();