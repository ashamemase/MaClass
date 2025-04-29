import { kanjiStrokeViewBase } from "./kanjiView.js";
import { Point } from "./positionaer.js";

export class KanjiQuizView extends kanjiStrokeViewBase {
  private strokeStart: boolean = false;
  private hasPointer: boolean = false;
  private userPoints: Point[] = [];
  private pathPoints: Point[] = [];
  private currentQuizStroke: number = 0;

  constructor(SVGElement: SVGSVGElement, container: string) {
    super(SVGElement, container);
    this.SVGElement.style.width = "400";
    this.SVGElement.style.height = "400";
    this.SVGElement.style.border = "solid";
    this.time=100;
    //    this.hideAll();
    this.grayOutAll();
    this.removeStrokeNumber();
    this.setListener();
    this.setQuizStroke();
  }

  //Quiz準備
  private setQuizStroke() {
    if(this.paths.length<=this.currentQuizStroke) return;
    this.pathPoints = this.path2Points(this.currentQuizStroke);
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

  private grayOutAll(){
    for(const path of this.paths){
        path.style.stroke="#b0b0b0";
    }
  }

  //イベントリスナー系処理

  public setListener() {
    // マッピング
    const startEvents = ["mousedown", "touchstart", "pointerdown"];
    const moveEvents = ["mousemove", "touchmove", "pointermove"];
    const endEvents = ["mouseup", "touchend", "pointerup"];

    for (const ev of startEvents) {
      this.SVGElement.addEventListener(ev, (e) => this.handleStart(e));
    }
    for (const ev of moveEvents) {
      this.SVGElement.addEventListener(ev, (e) => this.handleMove(e));
    }
    for (const ev of endEvents) {
      this.SVGElement.addEventListener(ev, (e) => this.handleEnd(e));
    }

    for (const ev of endEvents) {
      document.addEventListener(ev, (e) => this.handleDocumentEnd(e));
    }
  }

  private handleStart(event: Event) {
    if (this.strokeStart || (this.hasPointer && !(event instanceof PointerEvent))) return;

    if (event instanceof PointerEvent) {
      this.hasPointer = true;
      this.SVGElement.setPointerCapture(event.pointerId);
      if (this.strokeStart) return;
    }

    const point = this.getPoint(event);
    if (point) this.startUserStroke(point);
  }

  private handleMove(event: Event) {
    if (!this.strokeStart) return;
    if (this.hasPointer && !(event instanceof PointerEvent)) return;

    const point = this.getPoint(event);
    if (point) this.moveUserStroke(point);
  }

  private handleEnd(event: Event) {
    if (!this.strokeStart) return;
    if (event instanceof PointerEvent) {
      this.SVGElement.releasePointerCapture(event.pointerId);
    }

    const point = this.getPoint(event);
    if (point) this.endUserStroke(point);
  }

  private handleDocumentEnd(event: Event) {
    if (!this.strokeStart || (this.hasPointer && !(event instanceof PointerEvent))) return;

    this.userPoints = [];
    this.strokeStart = false;
    this.removeUserPath();
  }

  private getPoint(event: Event): Point | null {
    const { top, left } = this.SVGElement.getBoundingClientRect();
    const ratioX = this.SVGElement.width.baseVal.value / this.SVGElement.viewBox.baseVal.width;
    const ratioY = this.SVGElement.height.baseVal.value / this.SVGElement.viewBox.baseVal.height;
    const pt = this.SVGElement.createSVGPoint();
    if (event instanceof MouseEvent || event instanceof PointerEvent) {
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgPoint = pt.matrixTransform(this.SVGElement.getScreenCTM()?.inverse());
      return { x: svgPoint.x, y: svgPoint.y };
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) return null;
      pt.x = touch.clientX;
      pt.y = touch.clientY;
      const svgPoint = pt.matrixTransform(this.SVGElement.getScreenCTM()?.inverse());
      return { x: svgPoint.x, y: svgPoint.y };
    }
    return null;
  }

  //イベントハンドラ系処理
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
    const result=this.pathMatch()
    console.log(result);
    if (result)this.drawCorrectStroke();
    this.userPoints = [];
    this.strokeStart = false;
    this.removeUserPath();
  }

  //ユーザーパス系処理

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
    this.SVGElement.appendChild(path);
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

  //正解判定系
  private pathMatch(): boolean {
    const averageDistanceThreshold = 10;
    const startAndEndThreshold = 10;
    const frechetThreshold = 0.2;
    const minLengthThreshold = 0.5;
    const cosingSimilarityThreshold = 0;
    if (this.userPoints.length < 2) return false;
    //距離が範囲内にあるかどうか
    const withinDistThresh = Point.getAverageDistance(this.userPoints, this.pathPoints) <= averageDistanceThreshold;
       const ad = Point.getAverageDistance(this.userPoints, this.pathPoints);
    //startAndEndMatch
    const startAndEndMatch =
      Point.distance(this.userPoints[0], this.pathPoints[0]) <= startAndEndThreshold &&
      Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]) <= startAndEndThreshold;
      const se =
         Point.distance(this.userPoints[0], this.pathPoints[0]) +
        Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]);
    //
    const shapeMatch = this.shapeFit(this.userPoints, this.pathPoints) <= frechetThreshold;
      const sm = this.shapeFit(this.userPoints, this.pathPoints);
    const directionMatch = this.avgSimilaryty(this.userPoints, this.pathPoints) > cosingSimilarityThreshold;
      const dm = this.avgSimilaryty(this.userPoints, this.pathPoints);
    const lengthMatch = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25) > minLengthThreshold;
      const lm = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25);
      console.log({ad,se,sm,dm,lm});
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
  
  //正解動作
  drawCorrectStroke(){
    const path =this.paths[this.currentQuizStroke];
    path.style.display="none";
    path.style.stroke="#000000";
    this.startDrowStroke(this.currentQuizStroke);
    this.currentQuizStroke++
    this.setQuizStroke();
  }

}
