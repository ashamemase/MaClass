import { event } from "jquery";

export class kanjiBase {
  protected _SVGElement: SVGSVGElement;
  protected _container: HTMLElement;

  constructor(SVGElement: SVGSVGElement, container: HTMLElement | string) {
    if (typeof container == "string") {
      this._container = document.getElementById(container) as HTMLElement;
    } else {
      this._container = container;
    }
    this._SVGElement = SVGElement.cloneNode(true) as SVGSVGElement;
    this._container.appendChild(this._SVGElement);
  }

  public removeStrokeNumber() {
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
  protected time: number = 500; // アニメーション全体の速度制御用
  protected running: boolean = false; // 現在アニメーション中かどうか
  protected pathLength: number = 0; // 現在描画中のストロークの長さ
  protected interval: number = 0; // 1ステップのアニメーション間隔
  protected timer: number = 0; // アニメーション用のタイマーID
  protected paths: NodeListOf<SVGPathElement>;
  protected texts: NodeListOf<SVGTextElement>;

  constructor(sgvElement: SVGSVGElement, container: string) {
    super(sgvElement, container);
    this.paths=this.SVGElement.querySelectorAll("path") as NodeListOf<SVGPathElement>;
    this.texts=this.SVGElement.querySelectorAll("text") as NodeListOf<SVGTextElement>;
  }

  protected startDrowStroke(number: number) {
    if (this.running) return;
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

  private DoAnimation(path: SVGPathElement): void {
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
      this.timer=0;
      const event=new CustomEvent("stroke-end");
      this.container.dispatchEvent(event);//親にイベント発行
    }
  }

  /**アニメーション用の下準備 */
  private prepareDrowStroke(path: SVGPathElement, text: SVGTextElement) {
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
  public reset(): void {
    this.running = false;
    if(this.timer){
      clearInterval(this.timer);
      this.timer=0
    }
    this.hideAll();
  }

  /**指定したストロークを非表示にする */
  protected hidestroke(number: number) {
    if (this.paths.length <= number) return;
    this.paths[number].style.display = "none";
  }
  // 全てのストロークと順番表示を非表示にする
  protected hideAll(): void {
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
  count:number=0;
  constructor(sgvElement: SVGSVGElement, container: string) {
    super(sgvElement, container);
    this.SVGElement.style.height="200";
    this.SVGElement.style.width="200";
    this.hideAll()
    this.colorstrokes();
    this.setEventListner();
    this.startDrowStroke(0);

  }
  /**イベントリスナー */
  setEventListner(){
    this.container.addEventListener("click",(event:MouseEvent)=>{
      this.reset();
      this.doStrokeAnimation();
    })
    this.container.addEventListener("stroke-end",()=>{
      this.onStrokeEnd();
    });
  }

  doStrokeAnimation(){
    this.count=0;
    this.startDrowStroke(this.count);
  }

  onStrokeEnd(){
    this.count++;
    if(this.paths.length<=this.count) return;
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
  private colorPicker(strokeNumber: number): {
    hue: number;
    saturation: number;
    lightness: number;
  }[] {
    const colors: { hue: number; saturation: number; lightness: number }[] = [];
    const shuffledColors: { hue: number; saturation: number; lightness: number }[] = [];
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
 
