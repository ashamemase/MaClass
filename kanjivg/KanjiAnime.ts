export {};

// KanjiAnimatorクラスをwindowに登録してグローバルに使えるようにする
  declare global {
    interface Window {
      kanjiAnimator: KanjiAnimator;
    }
  }
  
  // DOMの読み込みが完了したら初期化処理を実行
  document.addEventListener("DOMContentLoaded", (event: Event) => {
    // グローバルインスタンスを生成
    window.kanjiAnimator = new KanjiAnimator();
  
    // SVG要素（id="svg-animation"）がクリックされたらアニメーションを実行
    const el = document.querySelector("svg#svg-animation") as SVGSVGElement;
    if (el) {
      el.addEventListener("click", () => {
        window.kanjiAnimator.play(el);
      });
    }
  });
  
  // 漢字の筆順アニメーションを制御するクラス
  class KanjiAnimator {
    private time: number;                           // アニメーション全体の速度制御用
    private running: boolean;                       // 現在アニメーション中かどうか
    private paths!: NodeListOf<SVGPathElement>;     // ストローク（筆）パスのリスト
    private texts!: NodeListOf<SVGTextElement>;     // 各ストロークの順番表示用テキスト
    private count: number;                          // 現在のストロークのインデックス
    private pathLength: number;                     // 現在描画中のストロークの長さ
    private interval: number;                       // 1ステップのアニメーション間隔
    private timer: number;                          // アニメーション用のタイマーID
  
    constructor(time: number = 20) {
      this.time = time;
      this.running = false;
      this.count = 0;
      this.pathLength = 0;
      this.interval = 0;
      this.timer = 0;
    }
  
    // アニメーションを開始する
    public play(svg: SVGSVGElement): void {
      if (this.running) return;
      this.running = true;
  
      // 既にタイマーがあればクリア
      if (this.timer !== 0) {
        clearInterval(this.timer);
      }
  
      console.log("アニメーション開始");
  
      // SVG内のストロークと順番表示を取得
      this.paths = svg.querySelectorAll("path");
      this.texts = svg.querySelectorAll("text");
  
      // カウンタ初期化・非表示化
      this.count = 0;
      this.hideAll();
  
      // 最初のストロークから開始
      const path = this.paths[this.count];
      const text = this.texts[this.count];
      this.AnimatePath(path, text);
  
      this.running = false;
    }
  
    // アニメーションを強制的にリセットする
    public reset(): void {
      this.running = false;
      console.log("アニメーションリセット");
    }
  
    // 単一のストロークのアニメーション準備と開始
    private AnimatePath(path: SVGPathElement, text: SVGTextElement): void {
      this.pathLength = path.getTotalLength();
  
      path.style.display = "block";
      if (typeof text !== "undefined") {
        text.style.display = "block";
      }
  
      // ストローク描画用の下準備
      path.style.transition = "none";
      path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
      path.style.strokeDashoffset = this.pathLength.toString();
      path.getBoundingClientRect(); // レンダリング強制
  
      // アニメーションの速度設定
      this.interval = this.time / this.pathLength;
  
      // アニメーション実行
      this.DoAnimation(path);
    }
  
    // ストローク1本を描くアニメーション本体
    private DoAnimation(path: SVGPathElement): void {
      // タイマーで次のフレームを設定
      this.timer = setTimeout(() => {
        this.DoAnimation(path);
      }, this.time);
  
      // 描画を少しずつ進める
      path.style.strokeDashoffset = this.pathLength.toString();
      this.pathLength--;
  
      // ストロークが描き終わったら次へ
      if (this.pathLength < 0) {
        clearInterval(this.timer); // 現在のタイマー停止
        this.time = 0;
        this.count++;
  
        if (this.count < this.paths.length) {
          const newPath = this.paths[this.count];
          const newText = this.texts[this.count];
          this.AnimatePath(newPath, newText); // 次のストロークへ
        }
      }
    }
  
    // 全てのストロークと順番表示を非表示にする
    private hideAll(): void {
      for (const path of this.paths) {
        path.style.display = "none";
      }
      for (const text of this.texts) {
        if (typeof text !== "undefined") {
          text.style.display = "none";
        }
      }
    }
  }