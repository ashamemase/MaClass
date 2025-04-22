// DOMの読み込みが完了したら初期化処理を実行
document.addEventListener("DOMContentLoaded", (event) => {
    // グローバルインスタンスを生成
    window.kanjiAnimator = new KanjiAnimator();
    // SVG要素（id="svg-animation"）がクリックされたらアニメーションを実行
    const el = document.querySelector("svg#svg-animation");
    if (el) {
        el.addEventListener("click", () => {
            window.kanjiAnimator.play(el);
        });
    }
});
// 漢字の筆順アニメーションを制御するクラス
class KanjiAnimator {
    constructor(time = 20) {
        this.time = time;
        this.running = false;
        this.count = 0;
        this.pathLength = 0;
        this.interval = 0;
        this.timer = 0;
    }
    // アニメーションを開始する
    play(svg) {
        if (this.running)
            return;
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
    reset() {
        this.running = false;
        console.log("アニメーションリセット");
    }
    // 単一のストロークのアニメーション準備と開始
    AnimatePath(path, text) {
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
    DoAnimation(path) {
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
    hideAll() {
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
class SVGLoader {
    constructor(containerId) {
        this.containerId = containerId;
    }
    async load(char) {
        var _a;
        const codePoint = char.codePointAt(0);
        if (!codePoint)
            return;
        const fileName = codePoint.toString(16).toUpperCase().padStart(5, "0");
        try {
            const response = await fetch(`./svg/${fileName}.svg`);
            const text = await response.text();
            const match = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
            if (!match) {
                console.error("SVGタグが見つかりませんでした");
                return;
            }
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(match[0], "image/svg+xml");
            const svgEl = svgDoc.documentElement;
            const container = document.getElementById(this.containerId);
            if (!container)
                return;
            const { width: divW, height: divH } = container.getBoundingClientRect();
            const vb = (_a = svgEl.getAttribute("viewBox")) === null || _a === void 0 ? void 0 : _a.split(" ").map(Number);
            if (!vb || vb.length !== 4) {
                console.error("viewBoxが無効です");
                return;
            }
            const [x, y, w, h] = vb;
            const scale = Math.min(divW / w, divH / h);
            svgEl.setAttribute("width", (w * scale).toString());
            svgEl.setAttribute("height", (h * scale).toString());
            svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
            container.innerHTML = "";
            container.appendChild(svgEl);
        }
        catch (err) {
            console.error("SVGの読み込みに失敗しました:", err);
        }
    }
}
export {};
