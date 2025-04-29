export class kanjiBase {
    constructor(SVGElement, container) {
        if (typeof container == "string") {
            this._container = document.getElementById(container);
        }
        else {
            this._container = container;
        }
        this._SVGElement = SVGElement.cloneNode(true);
        this._container.appendChild(this._SVGElement);
    }
    removeStrokeNumber() {
        const gloupNum = this._SVGElement.querySelectorAll('[id^="kvg:StrokeNumbers"]');
        this._SVGElement.removeChild(gloupNum[0]);
    }
    get container() {
        return this._container;
    }
    get SVGElement() {
        return this._SVGElement;
    }
}
export class kanjiStrokeViewBase extends kanjiBase {
    constructor(sgvElement, container) {
        super(sgvElement, container);
        this.time = 500; // アニメーション全体の速度制御用
        this.running = false; // 現在アニメーション中かどうか
        this.pathLength = 0; // 現在描画中のストロークの長さ
        this.interval = 0; // 1ステップのアニメーション間隔
        this.timer = 0; // アニメーション用のタイマーID
        this.paths = this.SVGElement.querySelectorAll("path");
        this.texts = this.SVGElement.querySelectorAll("text");
    }
    startDrowStroke(number) {
        if (this.running)
            return;
        this.running = true;
        // 既にタイマーがあればクリア
        if (this.timer !== 0) {
            clearInterval(this.timer);
        }
        // ストロークの準備
        const path = this.paths[number];
        const text = this.texts[number];
        this.prepareDrowStroke(path, text);
        this.DoAnimation(path);
        this.running = false;
    }
    DoAnimation(path) {
        // タイマーで次のフレームを設定
        this.timer = setTimeout(() => {
            this.DoAnimation(path);
        }, this.interval);
        // 描画を少しずつ進める
        path.style.strokeDashoffset = this.pathLength.toString();
        this.pathLength--;
        // ストロークが描き終わったらタイマー終了
        if (this.pathLength < 0) {
            clearInterval(this.timer); // 現在のタイマー停止
            this.timer = 0;
            const event = new CustomEvent("stroke-end");
            this.container.dispatchEvent(event); //親にイベント発行
        }
    }
    /**アニメーション用の下準備 */
    prepareDrowStroke(path, text) {
        this.pathLength = path.getTotalLength();
        // ストローク描画用の下準備
        path.style.transition = "none";
        path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
        path.style.strokeDashoffset = this.pathLength.toString();
        path.style.display = "block";
        if (typeof text !== "undefined") {
            text.style.display = "block";
        }
        path.getBoundingClientRect(); // レンダリング強制
        // アニメーションの速度設定
        this.interval = this.time / this.pathLength;
    }
    // アニメーションを強制的にリセットする
    reset() {
        this.running = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = 0;
        }
        this.hideAll();
    }
    /**指定したストロークを非表示にする */
    hidestroke(number) {
        if (this.paths.length <= number)
            return;
        this.paths[number].style.display = "none";
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
export class kanjiStrokeView extends kanjiStrokeViewBase {
    constructor(sgvElement, container) {
        super(sgvElement, container);
        this.count = 0;
        this.SVGElement.style.height = "200";
        this.SVGElement.style.width = "200";
        this.hideAll();
        this.colorstrokes();
        this.setEventListner();
        this.startDrowStroke(0);
    }
    /**イベントリスナー */
    setEventListner() {
        this.container.addEventListener("click", (event) => {
            this.reset();
            this.doStrokeAnimation();
        });
        this.container.addEventListener("stroke-end", () => {
            this.onStrokeEnd();
        });
    }
    doStrokeAnimation() {
        this.count = 0;
        this.startDrowStroke(this.count);
    }
    onStrokeEnd() {
        this.count++;
        if (this.paths.length <= this.count)
            return;
        this.startDrowStroke(this.count);
    }
    /**ストローク用の色わけ */
    colorstrokes() {
        const colors = this.colorPicker(this.paths.length);
        let i = 0;
        for (let path of this.paths) {
            const color = colors[i];
            path.style.stroke = `hsl(${color.hue},${color.saturation}%,${color.lightness}%)`;
            this.texts[i].style.fill = `hsl(${color.hue},${color.saturation}%,${color.lightness}%)`;
            i++;
        }
    }
    /**色分け用の色の選択 */
    colorPicker(strokeNumber) {
        const colors = [];
        const shuffledColors = [];
        for (let i = 0; i < strokeNumber; i++) {
            colors.push({ hue: (360 / strokeNumber) * i, saturation: 60 + (i % 4) * 10, lightness: 40 + (i % 3) * 10 });
        }
        let j = 0;
        while (colors.length > 0) {
            const count = j % colors.length;
            const color = colors[count];
            shuffledColors.push(color);
            colors.splice(count, 1);
            j += 7;
        }
        return shuffledColors;
    }
}
