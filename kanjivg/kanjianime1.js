


class KanjiAnimator {
    constructor(time = 500) {
      this.time = time;
      this.running = false;
    }
  
    play(svg) {
      if (this.running) return;
      this.running = true;
  
      // パス抽出、非表示、アニメーション開始...
      // 最後に this.running = false に戻す
    }
  
    // 必要なら reset() など
  }