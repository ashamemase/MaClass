class Square {
    constructor(squareSize, squareSpeed, mainContainer, charactor) {
        this.squareSize = squareSize;
        this.squareSpeed = squareSpeed;
        this.mainContainer = mainContainer;
        this.square = null;
        this.charactor = charactor;
    }

    createsquare() {
        this.square = document.createElement('div');
        this.square.classList.add('square');
        this.square.style.width = `${this.squareSize}px`;
        this.square.style.height = `${this.squareSize}px`;
        this.square.style.left = `${Math.random() * (this.mainContainer.clientWidth - this.squareSize)}px`;
        this.square.style.top = `${Math.random() * (this.mainContainer.clientHeight - this.squareSize)}px`;
        this.square.style.border='1px solid black';
        this.square.style.backgroundColor = 'white';
        this.square.style.borderRadius='0'
        this.square.dx = (Math.random() - 0.5) * this.squareSpeed;
        this.square.dy = (Math.random() - 0.5) * this.squareSpeed;
        // img要素を作成
        let img = document.createElement('img');
        // img要素のsrc属性に画像のURLを設定
        img.src = 'img/'+this.charactor+'.png';
        // img要素のサイズをsquare要素と同じに設定
        img.style.width = '100%';
        img.style.height = '100%';

        // img要素をsquare要素の子要素として追加
        this.square.appendChild(img);

        this.mainContainer.appendChild(this.square);

    }
    movesquares() {
        let x = parseFloat(this.square.style.left);
        let y = parseFloat(this.square.style.top);
        if (x < 0 || x > this.mainContainer.clientWidth - this.squareSize) {
            this.square.dx *= -1;
        }
        if (y < 0 || y > this.mainContainer.clientHeight - this.squareSize) {
            this.square.dy *= -1;
        }
        this.square.style.left = `${x + this.square.dx}px`;
        this.square.style.top = `${y + this.square.dy}px`;        
    }
    cleanup() {
        // squareオブジェクトをmainContainerから切り離す
        this.mainContainer.removeChild(this.square);
        // squareオブジェクトを消去する
        this.square = null;
    }
    // 他のメソッドをここに追加できます
}

class StopWatch {
    constructor(timerId) {
        this.timer = document.getElementById(timerId);
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
    }

    timeToString(time) {
        let deciseconds = Math.floor(time % 1000 / 100);
        let seconds = Math.floor(time / 1000 % 60);
        let minutes = Math.floor(time / 1000 / 60);

        return `${minutes}:${seconds}.${deciseconds}`;
    }

    startTimer() {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.timer.textContent = this.timeToString(this.elapsedTime);
             // カスタムイベントを作成
             let event = new CustomEvent('timerTick', { detail: this.elapsedTime });
             // イベントを発行
             this.timer.dispatchEvent(event);
        }, 100);
        
    }

    getTime(){
        return Date.now() - this.startTime;
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.elapsedTime = 0;
        this.timer.textContent = '0.0';
    }
}

class AudioPlayer {
    constructor() {
        this.audio = new Audio();
    }

    play(file) {
        if (file && this.audio.src !== file){
            this.audio.src = file;
        }
        if (this.audio.paused) {
            let playPromise=this.audio.play();  // 再生する
            if(playPromise !==undefined) {
                playPromise.then(_ => {
                  // Automatic playback started!
                  // Show playing UI.
                  // We can now safely pause video...
                  this.player.pause();
                })
                .catch(error => {
                  // Auto-play was prevented
                  // Show paused UI.
                });
              }
        } else {
            this.audio.pause();  // 一時停止する
            this.audio.currentTime = 0;  // 再生位置をリセットする
        }
    }
}

class Screen {
    constructor(screenId) {
        this.screenElement = document.getElementById(screenId);
        this.isActive = false;
        this.init();
    }

    init() {
        // イベントリスナーの設定など
        document.addEventListener('click', (event) => {
            if (this.isActive) {
                // このスクリーンがアクティブなときだけイベントを処理する
                this.handleClick(event);
            }
        });
    }

    handleClick(event) {
        // ここにクリックイベントの処理を書く
    }

    activate() {
        this.isActive = true;
        this.screenElement.classList.add('active');
    }

    deactivate() {
        this.isActive = false;
        this.screenElement.classList.remove('active');
    }
}

class StartScreen extends Screen {
    init(){
        super.init();
    }
    handleClick(event) {
        // ScreenA固有のクリックイベントの処理を書く
    }
}

class GameScreen extends Screen {
    
    init(){
        this.timer=new StopWatch('timer');
        this.mainContainer= document.getElementById('main-container');
        this.squares=new Array();
        this.hiragana = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 
            'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 
            'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'
        ];
        this.romaji = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 
            'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 
            'ha', 'hi', 'fu', 'he', 'ho',  'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n'
        ];
        this.player = new AudioPlayer;
        this.scores=[999000,999000,999000,999000,999000];

        // タイマー用イベントリスナーを設定
        document.getElementById('timer').addEventListener('timerTick', (event) => {  // アロー関数を使用
            // イベントの詳細（この場合は経過時間）を取得
            let elapsedTime = event.detail;
            this.squares.forEach(element => {
                element.movesquares();
            });
        });

    // ここに処理を記述します

        this.newQuiz=0;
        this.currentQuiz=0;
        this.score=0;
        this.resultText="";
        super.init();
    }
    activate(){
        //activateされた場合、ゲームの初期化処理をします。
        this.timer.resetTimer();
        this.newQuiz=0;
        this.currentQuiz=0;
        for(let i=0; i<this.squares.length;i++){
            this.squares[i].cleanup();
        }
        this.squares.length=0;
        this.score=0;
        this.timer.startTimer();
        for(let i=0;i<10;i++){
            let square = new Square(this.mainContainer.clientHeight / 10,4,this.mainContainer,this.romaji[this.newQuiz]);
            square.createsquare();
            this.squares.push(square);
            this.newQuiz++;
        }   
        super.activate();
        this.player.play("./sounds/"+this.romaji[this.currentQuiz]+".mp3");
    }

    handleClick(event) {
        let src=String(event.target.src)
        let filename=src.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
        if (filename!==null) {
            // ここにクリックされた'square'オブジェクトに対する処理を記述します
            this.squares.forEach(element => {
                if(element.charactor==filename){
                    if(element.charactor==this.romaji[this.currentQuiz]){
                        //正解
                        this.squares.splice(this.squares.indexOf(element),1);
                        element.cleanup();
                        this.currentQuiz++;
                        if(this.currentQuiz<this.romaji.length){
                            if(this.newQuiz<this.romaji.length){
                                let square = new Square(this.mainContainer.clientHeight / 10,2,this.mainContainer,this.romaji[this.newQuiz]);
                                square.createsquare();
                                this.squares.push(square);                            
                                this.newQuiz++;                        
                            }
                            this.player.play("./sounds/"+this.romaji[this.currentQuiz]+".mp3");
                        }else{
                            //ゲーム終了
                            
                            this.endGame();
                        }

                    }else{
                        //不正解
                        this.player.play("./sounds/wrong.mp3");
                        //ペナルティとして、３秒追加します
                        this.timer.startTime-=3000;
                    }
                }
                if(element.charactor==filename && element.charactor==this.romaji[this.currentQuiz]){
                }
            });
        }
        let clickedElement=event.target;
        if(clickedElement.id=="sound"){
            this.player.play("./sounds/"+this.romaji[this.currentQuiz]+".mp3");
        }
        // ScreenB固有のクリックイベントの処理を書く
    }

    endGame(){
        this.timer.stopTimer();
        this.score=this.timer.getTime();
        // スコアが低い方が良いということなので、昇順にソートする
        this.scores.sort((a, b) => a - b);

        // 新たなスコアが上位５位以内に入るかどうか判定する
        let rank = -1; // ランクを表す変数
        for (let i = 0; i < this.scores.length; i++) {
            if (this.score < this.scores[i]) {
                rank = i + 1; // スコアがscores[i]より小さい場合、その位置にランクインする
                break;
            }
        }

        // 結果を表示する
        this.resultText=("<p>Your score is " + this.score + ".</p>");
        if (rank > 0) {
            this.resultText+="<p>Congratulations! You ranked in at " + rank + "th place!</p>";
            // 新たなスコアをscores配列に挿入する
            this.scores.splice(rank - 1, 0, this.score);
            // scores配列の末尾の要素を削除する
            this.scores.pop();
        } else {
            this.resultText+="<p>Sorry, you did not rank in.</p>";
        }

        // 上位５位のスコアを表示する
        this.resultText+="<p>The top 5 scores are as follows.</p>";
        for (let i = 0; i < this.scores.length; i++) {
            // 新たなスコアが入った場合は、<em>で強調する
            if (scores[i] === score) {
                this.resultText+=(i + 1) + "th place: <em>" + this.scores[i] + "</em><br>";
            } else {
                this.resultText+=(i + 1) + "th place: " + this.scores[i]+"<br>";
            }
        }
    }
    
}

class ResultScreen extends Screen{

    activate(){
        let resultContainer=this.screenElement.getElementById("result-container");
        resultContainer.innerHTML=gameScreen.resultText;
        super.activate();
    }
}



var startScreen;
var gameScreen;
var resultScreen;
document.addEventListener('DOMContentLoaded', (event) => {
    startScreen=new StartScreen('startScreen')
    gameScreen=new GameScreen('gameScreen')
    resultScreen=new ResultScreen('resultScreen')
});

// 画面切り替え
function switchScreen(screen) {
    // すべてのスクリーンを非アクティブにする
    startScreen.deactivate();
    gameScreen.deactivate();
    // 指定されたスクリーンをアクティブにする
    switch(screen){
        case 'startScreen':
            startScreen.activate();
            break;
        case 'gameScreen':
            gameScreen.activate();
            break;
        case 'resultScreen':
            resultScreen.activate();
            break;
    }
}



