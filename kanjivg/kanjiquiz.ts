import { event } from "jquery";

export {};

declare global {
  interface Window {
    quiz: Quiz;
  }
}

document.addEventListener("DOMContentLoaded", (event: Event) => {
  window.quiz = new Quiz("遺");
  window.quiz.init();
});

interface PointLike {
  x: number;
  y: number;
}

class Point implements PointLike {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public static add(p1: Point, p2: Point): Point {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }
  public static subtract(p1: Point, p2: Point): Point {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }
  public static distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  public static scalerMultiply(p1: Point, multiplier: number): Point {
    return { x: p1.x * multiplier, y: p1.y * multiplier };
  }
  public static scalerDivide(p1: Point, divider: number): Point {
    return { x: p1.x / divider, y: p1.y / divider };
  }
  /**絶対値を返します*/
  public static magnitude(p1: Point): number {
    return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
  }
  /**全ての点の平均一を求めます */
  public static average(points: Point[]): Point {
    const point = points.reduce((acc, val) => this.add(acc, val), {
      x: 0,
      y: 0,
    });
    return this.scalerDivide(point, Point.length);
  }
  /**全ての点を順に結んだ時の長さを返します */
  public static pointsLength(points: Point[]): number {
    let lastPoint = points[0];
    const pointsRemain = points.slice(1);
    return pointsRemain.reduce((acc, point) => {
      const dist = this.distance(point, lastPoint);
      lastPoint = point;
      return acc + dist;
    }, 0);
  }
  /**二点が同じであるか、評価します */
  public static equals(point1: Point, point2: Point): boolean {
    return point1.x === point2.x && point1.y === point2.y;
  }

  /**順に並んでいる点で隣り合う点同士が同じであるものを消去します */
  public static stripDuplicates(points: Point[]):Point[]{
    if (points.length < 2) return points;
    const [firstPoint, ...rest] = points;
    const dedupedPoints = [firstPoint];
    for (const point of rest) {
      if (!this.equals(point, dedupedPoints[dedupedPoints.length - 1])) {
        dedupedPoints.push(point);
      }
    }
    return dedupedPoints;
  }
  /**２つのベクトルの内積を求めます  */
  public static innerProduct(vector1: Point, vector2: Point): number {
    return   vector1.x * vector2.x+  vector1.y * vector2.y ;
  }
  /**p1とp2の線分をp2よりdist倍分だけ延長します */
  private static _extendPointOnLine(p1: Point, p2: Point, dist: number): Point {
    const vect = { x: p2.x - p1.x, y: p2.y - p1.y };
    const norm = dist / Math.sqrt(Math.pow(vect.x, 2) + Math.pow(vect.y, 2));
    return { x: p2.x + norm * vect.x, y: p2.y + norm * vect.y };
  }
  /**Point[]で結ばれた線分を基に、Point数をnumPointsに修正したPoint[]を返します */
  public static outlineCurve(curve: Point[], numPoints = 30): Point[] {
    const curveLength = this.pointsLength(curve);
    const segmentLength = curveLength / (numPoints - 1);
    const outlinePoints = [curve[0]];
    const endPoint = curve[curve.length - 1];
    const remainingCurvePoints = curve.slice(1);
    for (let i = 0; i < numPoints - 2; i++) {
      let lastPoint: Point = outlinePoints[outlinePoints.length - 1];
      let remainingDist = segmentLength;
      let outlinePointFound = false;
      while (!outlinePointFound) {
        const nextPointDist = this.distance(lastPoint, remainingCurvePoints[0]);
        if (nextPointDist < remainingDist) {
          remainingDist -= nextPointDist;
          lastPoint = remainingCurvePoints.shift()!;
        } else {
          const nextPoint = this._extendPointOnLine(lastPoint, remainingCurvePoints[0], remainingDist - nextPointDist);
          outlinePoints.push(nextPoint);
          outlinePointFound = true;
        }
      }
    }
    outlinePoints.push(endPoint);
    return outlinePoints;
  }
  /**原点中心に(-1,1)の間になるように各点を正規化します */
  public static normalizeCurve(curve: Point[]): Point[] {
    const outlinedCurve = this.outlineCurve(curve);
    const mean = this.average(curve);

    const translatedCurve = outlinedCurve.map((point) => this.subtract(point, mean));
    const scale = Math.sqrt(
      (Math.pow(translatedCurve[0].x, 2) +
        Math.pow(translatedCurve[0].y, 2) +
        Math.pow(translatedCurve[translatedCurve.length - 1].x, 2) +
        Math.pow(translatedCurve[translatedCurve.length - 1].y, 2)) /
        2
    );
    const scaledCurve = translatedCurve.map((point) => this.scalerDivide(point, scale));
    return this.subdivideCurve(scaledCurve);
  }
  /**Point[]で結ばれた線分を細かく分割して、新たなPoint[]を返します */
  private static subdivideCurve(curve: Point[], maxLen = 0.05): Point[] {
    const newCurve = curve.slice(0, 1);

    for (const point of curve.slice(1)) {
      const prevPoint = newCurve[newCurve.length - 1];
      const segLen = this.distance(point, prevPoint);
      if (segLen > maxLen) {
        const numNewPoints = Math.ceil(segLen / maxLen);
        const newSegLen = segLen / numNewPoints;
        for (let i = 0; i < numNewPoints; i++) {
          newCurve.push(this._extendPointOnLine(point, prevPoint, -1 * newSegLen * (i + 1)));
        }
      } else {
        newCurve.push(point);
      }
    }

    return newCurve;
  }
  /**pointsBaseの各点について、一番近いpointsReferenceの点までの距離の平均値を返します*/
  public static getAverageDistance(pointsBase: Point[], pointsReference: Point[]): number {
    const totalDist = pointsBase.reduce((acc, pointBas): number => {
      const distances = pointsReference.map((pointRef) => this.distance(pointBas, pointRef));
      return acc+Math.min(...distances);
    }, 0);
    return totalDist / pointsBase.length;
  }
  /**二つの線分のフレシェ距離を計算して返します */
  public static frechetDistance(curve1: Point[], curve2: Point[]): number {
    const longCurve = curve1.length >= curve2.length ? curve1 : curve2;
    const shortCurve = curve1.length >= curve2.length ? curve2 : curve1;

    const calcVal = (i: number, j: number, prevResultsCol: number[], curResultsCol: number[]): number => {
      if (i === 0 && j === 0) {
        return this.distance(longCurve[0], shortCurve[0]);
      }
      if (i > 0 && j === 0) {
        return Math.max(prevResultsCol[0], this.distance(longCurve[i], shortCurve[0]));
      }
      const lastResult = curResultsCol[curResultsCol.length - 1];
      if (i === 0 && j > 0) {
        return Math.max(lastResult, this.distance(longCurve[0], shortCurve[j]));
      }
      return Math.max(Math.min(prevResultsCol[j], prevResultsCol[j - 1], lastResult), this.distance(longCurve[i], shortCurve[j]));
    };
    let prevResultsCol: number[] = [];
    for (let i = 0; i < longCurve.length; i++) {
      const curResultsCol: number[] = [];
      for (let j = 0; j < shortCurve.length; j++) {
        // we only need the results from i - 1 and j - 1 to continue the calculation
        // so we only need to hold onto the last column of calculated results
        // prevResultsCol is results[i-1][:] in the original algorithm
        // curResultsCol is results[i][:j-1] in the original algorithm
        curResultsCol.push(calcVal(i, j, prevResultsCol, curResultsCol));
      }
      prevResultsCol = curResultsCol;
    }
    return prevResultsCol[shortCurve.length - 1];
  }
  /**線分を原点を中心に回転させます */
  public static rotate(curve: Point[], theta: number): Point[] {
    return curve.map((point) => ({
      x: Math.cos(theta) * point.x - Math.sin(theta) * point.y,
      y: Math.sin(theta) * point.x + Math.cos(theta) * point.y,
    }));
  }
  /**全ての点から次の点へのベクトルを生成します */
  public static getEdgeVectors(points:Point[]){
      const vectors: Point[] = [];
      let lastPoint = points[0];
      points.slice(1).forEach((point) => {
        vectors.push(this.subtract(point, lastPoint));
        lastPoint = point;
      });
      return vectors;
  }
  /**二つのベクトルのなす角のコサインを求めます */
  public static cosineSimilarity(p1:Point,p2:Point):number{
    return Point.innerProduct(p1,p2)/(Point.magnitude(p1)*Point.magnitude(p2));
  }
}

class Quiz {
  private element!: SVGSVGElement;
  private chr: string;
  private paths!: NodeListOf<SVGPathElement>;
  private userPoints: Point[];
  private pathPoints: Point[];
  private pathCount: number = 0;
  private strokeStart: boolean = false;
  private hasPointer: boolean = false;
  private timer: number = 0;

  constructor(chr: string) {
    this.chr = chr;
    this.userPoints = [];
    this.pathPoints = [];
  }

  public init() {
    this.element = document.querySelector("svg#svg-quiz") as SVGSVGElement;
    this.paths = this.element.querySelectorAll("path");
    const texts = this.element.querySelectorAll("text");
    texts.forEach((item) => {
      item.style.display = "none";
    });
    this.pathPoints = this.path2Points(this.pathCount);
    this.setListner();
  }

  public setListner() {
    this.element.addEventListener("mousedown", (event: MouseEvent) => {
      if (this.strokeStart || this.hasPointer) return;
      const point = this.getMousePosition(event);
      this.startUserStroke(point);
    });
    this.element.addEventListener("touchstart", (event: TouchEvent) => {
      if (this.strokeStart || this.hasPointer) return;
      const point = this.getTouchPosition(event);
      this.startUserStroke(point);
    });
    this.element.addEventListener("pointerdown", (event: PointerEvent) => {
      this.hasPointer = true;
      this.element.setPointerCapture(event.pointerId);
      if (this.strokeStart) return;
      const point = this.getPointerPosition(event);
      this.startUserStroke(point);
    });
    this.element.addEventListener("mousemove", (event: MouseEvent) => {
      if (!this.strokeStart || this.hasPointer) return;
      const point = this.getMousePosition(event);
      this.moveUserStroke(point);
    });
    this.element.addEventListener("touchmove", (event: TouchEvent) => {
      if (!this.strokeStart || this.hasPointer) return;
      const point = this.getTouchPosition(event);
      this.moveUserStroke(point);
    });
    this.element.addEventListener("pointermove", (event: PointerEvent) => {
      if (!this.strokeStart) return;
      const point = this.getPointerPosition(event);
      this.moveUserStroke(point);
    });
    this.element.addEventListener("mouseup", (event: MouseEvent) => {
      if (this.hasPointer) return;
      const point = this.getMousePosition(event);
      this.endUserStroke(point);
    });
    this.element.addEventListener("touchend", (event: TouchEvent) => {
      if (this.hasPointer) return;
      const point = this.getTouchPosition(event);
      this.endUserStroke(point);
    });
    this.element.addEventListener("pointerup", (event: PointerEvent) => {
      this.element.releasePointerCapture(event.pointerId);
      const point = this.getPointerPosition(event);
      this.endUserStroke(point);
    });
    document.addEventListener("mouseup", (event: MouseEvent) => {
      if (!this.strokeStart || this.hasPointer) return;
      this.userPoints = [];
      this.strokeStart = false;
      this.removeUserPath();
    });
    document.addEventListener("touchend", (event: TouchEvent) => {
      if (!this.strokeStart || this.hasPointer) return;
      this.userPoints = [];
      this.strokeStart = false;
      this.removeUserPath();
    });
    document.addEventListener("pointerup", (event: PointerEvent) => {
      if (!this.strokeStart) return;
      this.userPoints = [];
      this.strokeStart = false;
      this.removeUserPath();
    });
  }

  private startUserStroke(point: Point) {
    this.userPoints = [];
    this.strokeStart = true;
    this.userPoints.push(point);
    this.prepareUserPath();
  }

  private moveUserStroke(point: Point) {
    this.userPoints.push(point);
    this.drawUserPath();
  }

  private endUserStroke(point: Point) {
    this.userPoints.push(point);
    this.userPoints = Point.stripDuplicates(this.userPoints);
    this.pathPoints = Point.stripDuplicates(this.pathPoints);
    console.log(this.pathMatch());
    this.userPoints = [];
    this.strokeStart = false;
    this.removeUserPath();
  }

  private getMousePosition(event: MouseEvent): Point {
    const { top, left } = this.element.getBoundingClientRect();
    const ratioX = this.element.width.baseVal.value / this.element.viewBox.baseVal.width;
    const ratioY = this.element.height.baseVal.value / this.element.viewBox.baseVal.height;
    const x = Math.round(((event.clientX - left) * 100) / ratioX) / 100;
    const y = Math.round(((event.clientY - top) * 100) / ratioY) / 100;
    return { x, y };
  }

  private getTouchPosition(event: TouchEvent): Point {
    const { top, left } = this.element.getBoundingClientRect();
    const ratioX = this.element.width.baseVal.value / this.element.viewBox.baseVal.width;
    const ratioY = this.element.height.baseVal.value / this.element.viewBox.baseVal.height;
    const x = Math.round(((event.touches[0].clientX - left) * 100) / ratioX) / 100;
    const y = Math.round(((event.touches[0].clientY - top) * 100) / ratioX) / 100;
    return { x, y };
  }

  private getPointerPosition(event: PointerEvent) {
    const { top, left } = this.element.getBoundingClientRect();
    const ratioX = this.element.width.baseVal.value / this.element.viewBox.baseVal.width;
    const ratioY = this.element.height.baseVal.value / this.element.viewBox.baseVal.height;
    const x = Math.round(((event.clientX - left) * 100) / ratioX) / 100;
    const y = Math.round(((event.clientY - top) * 100) / ratioY) / 100;
    return { x, y };
  }

  private path2Points(count: number): Point[] {
    const path = this.paths[count];
    const points: Point[] = [];
    const totalPathLength = path.getTotalLength();
    const steps = 100;
    for (let i = 0; i < steps; i++) {
      const point = path.getPointAtLength((i / steps) * totalPathLength);
      points.push(point);
    }
    return points;
  }

  private prepareUserPath() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const oldpath = document.getElementById("user-stroke");
    if (oldpath) {
      oldpath.remove();
    }
    path.setAttribute("id", "user-stroke");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "blue");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", "");
    this.element.appendChild(path);
  }

  private removeUserPath() {
    const oldpath = document.getElementById("user-stroke");
    if (oldpath) {
      oldpath.remove();
    }
  }

  private drawUserPath() {
    const path = document.getElementById("user-stroke");
    path?.setAttribute("d", this.Points2D(this.userPoints));
  }

  private Points2D(points: Point[]): string {
    if (points.length < 2) {
      return "";
    }
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
  }

  /**
   * 正解であるかどうかの判定用
   */
  private pathMatch(): boolean {
    const averageDistanceThreshold = 10;
    const startAndEndThreshold = 10;
    const frechetThreshold = 0.2;
    const minLengthThreshold = 0.5;
    const cosingSimilarityThreshold = 0;
    if (this.userPoints.length < 2) return false;
    //距離が範囲内にあるかどうか
    const withinDistThresh = Point.getAverageDistance(this.userPoints, this.pathPoints) <= averageDistanceThreshold;
    //   const ad = Point.getAverageDistance(this.userPoints, this.pathPoints);
    //startAndEndMatch
    const startAndEndMatch =
      Point.distance(this.userPoints[0], this.pathPoints[0]) <= startAndEndThreshold &&
      Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]) <= startAndEndThreshold;
    //  const se =
    //     Point.distance(this.userPoints[0], this.pathPoints[0]) <= startAndEndThreshold &&
    //    Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]);
    //
    const shapeMatch = this.shapeFit(this.userPoints, this.pathPoints) <= frechetThreshold;
    //  const sm = this.shapeFit(this.userPoints, this.pathPoints);
    const directionMatch = this.avgSimilaryty(this.userPoints, this.pathPoints) > cosingSimilarityThreshold;
    //  const dm = this.avgSimilaryty(this.userPoints, this.pathPoints);
    const lengthMatch = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25) > minLengthThreshold;
    //  const lm = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25);
    //  console.log({ad,se,sm,dm,lm});
    return withinDistThresh && startAndEndMatch && shapeMatch && directionMatch && lengthMatch;
  }

  private shapeFit(curve1: Point[], curve2: Point[]): number {
    const SHAPE_FIT_ROTATIONS = [Math.PI / 16, Math.PI / 32, 0, (-1 * Math.PI) / 32, (-1 * Math.PI) / 16];
    const normCurve1 = Point.normalizeCurve(curve1);
    const normCurve2 = Point.normalizeCurve(curve2);
    let minDist = Infinity;
    SHAPE_FIT_ROTATIONS.forEach((theta) => {
      const dist = Point.frechetDistance(normCurve1, Point.rotate(normCurve2, theta));
      if (dist < minDist) {
        minDist = dist;
      }
    });
    return minDist;
  }

  private avgSimilaryty(points1: Point[], points2: Point[]): number {
    const edgeVectors = Point.getEdgeVectors(points1);
    const strokeVectors = Point.getEdgeVectors(points2);
    const similarities = edgeVectors.map((edgeVector) => {
      const strokeSimilarities = strokeVectors.map((strokeVector) => Point.cosineSimilarity(strokeVector, edgeVector));
      return Math.max(...strokeSimilarities);
    });
    const avgSimilarity = similarities.reduce((acc, val) => acc + val, 0) / similarities.length;
    return avgSimilarity;
  }
  // 単一のストロークのアニメーション準備と開始
  private AnimatePath(path:SVGPathElement){
    
  }
  // ストローク1本を描くアニメーション本体
  private doAnimation(path: SVGPathElement) {}
}

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
