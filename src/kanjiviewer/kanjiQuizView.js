import { kanjiStrokeViewBase } from "./kanjiView.js";
import { Point } from "./positionaer.js";
export class KanjiQuizView extends kanjiStrokeViewBase {
    constructor(SVGElement, container) {
        super(SVGElement, container);
        this.strokeStart = false;
        this.hasPointer = false;
        this.userPoints = [];
        this.pathPoints = [];
        this.currentQuizStroke = 0;
        this.SVGElement.style.width = "400";
        this.SVGElement.style.height = "400";
        this.SVGElement.style.border = "solid";
        this.time = 100;
        //    this.hideAll();
        this.grayOutAll();
        this.removeStrokeNumber();
        this.setListener();
        this.setQuizStroke();
    }
    //Quiz準備
    setQuizStroke() {
        if (this.paths.length <= this.currentQuizStroke)
            return;
        this.pathPoints = this.path2Points(this.currentQuizStroke);
    }
    path2Points(count) {
        const path = this.paths[count];
        const points = [];
        const totalPathLength = path.getTotalLength();
        const steps = 100;
        for (let i = 0; i < steps; i++) {
            const point = path.getPointAtLength((i / steps) * totalPathLength);
            points.push(point);
        }
        return points;
    }
    grayOutAll() {
        for (const path of this.paths) {
            path.style.stroke = "#b0b0b0";
        }
    }
    //イベントリスナー系処理
    setListener() {
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
    handleStart(event) {
        if (this.strokeStart || (this.hasPointer && !(event instanceof PointerEvent)))
            return;
        if (event instanceof PointerEvent) {
            this.hasPointer = true;
            this.SVGElement.setPointerCapture(event.pointerId);
            if (this.strokeStart)
                return;
        }
        const point = this.getPoint(event);
        if (point)
            this.startUserStroke(point);
    }
    handleMove(event) {
        if (!this.strokeStart)
            return;
        if (this.hasPointer && !(event instanceof PointerEvent))
            return;
        const point = this.getPoint(event);
        if (point)
            this.moveUserStroke(point);
    }
    handleEnd(event) {
        if (!this.strokeStart)
            return;
        if (event instanceof PointerEvent) {
            this.SVGElement.releasePointerCapture(event.pointerId);
        }
        const point = this.getPoint(event);
        if (point)
            this.endUserStroke(point);
    }
    handleDocumentEnd(event) {
        if (!this.strokeStart || (this.hasPointer && !(event instanceof PointerEvent)))
            return;
        this.userPoints = [];
        this.strokeStart = false;
        this.removeUserPath();
    }
    getPoint(event) {
        var _a, _b;
        const { top, left } = this.SVGElement.getBoundingClientRect();
        const ratioX = this.SVGElement.width.baseVal.value / this.SVGElement.viewBox.baseVal.width;
        const ratioY = this.SVGElement.height.baseVal.value / this.SVGElement.viewBox.baseVal.height;
        const pt = this.SVGElement.createSVGPoint();
        if (event instanceof MouseEvent || event instanceof PointerEvent) {
            pt.x = event.clientX;
            pt.y = event.clientY;
            const svgPoint = pt.matrixTransform((_a = this.SVGElement.getScreenCTM()) === null || _a === void 0 ? void 0 : _a.inverse());
            return { x: svgPoint.x, y: svgPoint.y };
        }
        else if (event instanceof TouchEvent) {
            const touch = event.touches[0] || event.changedTouches[0];
            if (!touch)
                return null;
            pt.x = touch.clientX;
            pt.y = touch.clientY;
            const svgPoint = pt.matrixTransform((_b = this.SVGElement.getScreenCTM()) === null || _b === void 0 ? void 0 : _b.inverse());
            return { x: svgPoint.x, y: svgPoint.y };
        }
        return null;
    }
    //イベントハンドラ系処理
    startUserStroke(point) {
        this.userPoints = [];
        this.strokeStart = true;
        this.userPoints.push(point);
        this.prepareUserPath();
    }
    moveUserStroke(point) {
        this.userPoints.push(point);
        this.drawUserPath();
    }
    endUserStroke(point) {
        this.userPoints.push(point);
        this.userPoints = Point.stripDuplicates(this.userPoints);
        this.pathPoints = Point.stripDuplicates(this.pathPoints);
        const result = this.pathMatch();
        console.log(result);
        if (result)
            this.drawCorrectStroke();
        this.userPoints = [];
        this.strokeStart = false;
        this.removeUserPath();
    }
    //ユーザーパス系処理
    prepareUserPath() {
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
    removeUserPath() {
        const oldpath = document.getElementById("user-stroke");
        if (oldpath) {
            oldpath.remove();
        }
    }
    drawUserPath() {
        const path = document.getElementById("user-stroke");
        path === null || path === void 0 ? void 0 : path.setAttribute("d", this.Points2D(this.userPoints));
    }
    Points2D(points) {
        if (points.length < 2) {
            return "";
        }
        const [first, ...rest] = points;
        return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
    }
    //正解判定系
    pathMatch() {
        const averageDistanceThreshold = 10;
        const startAndEndThreshold = 10;
        const frechetThreshold = 0.2;
        const minLengthThreshold = 0.5;
        const cosingSimilarityThreshold = 0;
        if (this.userPoints.length < 2)
            return false;
        //距離が範囲内にあるかどうか
        const withinDistThresh = Point.getAverageDistance(this.userPoints, this.pathPoints) <= averageDistanceThreshold;
        const ad = Point.getAverageDistance(this.userPoints, this.pathPoints);
        //startAndEndMatch
        const startAndEndMatch = Point.distance(this.userPoints[0], this.pathPoints[0]) <= startAndEndThreshold &&
            Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]) <= startAndEndThreshold;
        const se = Point.distance(this.userPoints[0], this.pathPoints[0]) +
            Point.distance(this.userPoints[this.userPoints.length - 1], this.pathPoints[this.pathPoints.length - 1]);
        //
        const shapeMatch = this.shapeFit(this.userPoints, this.pathPoints) <= frechetThreshold;
        const sm = this.shapeFit(this.userPoints, this.pathPoints);
        const directionMatch = this.avgSimilaryty(this.userPoints, this.pathPoints) > cosingSimilarityThreshold;
        const dm = this.avgSimilaryty(this.userPoints, this.pathPoints);
        const lengthMatch = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25) > minLengthThreshold;
        const lm = (Point.pointsLength(this.userPoints) + 25) / (Point.pointsLength(this.pathPoints) + 25);
        console.log({ ad, se, sm, dm, lm });
        return withinDistThresh && startAndEndMatch && shapeMatch && directionMatch && lengthMatch;
    }
    shapeFit(curve1, curve2) {
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
    avgSimilaryty(points1, points2) {
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
    drawCorrectStroke() {
        const path = this.paths[this.currentQuizStroke];
        path.style.display = "none";
        path.style.stroke = "#000000";
        this.startDrowStroke(this.currentQuizStroke);
        this.currentQuizStroke++;
        this.setQuizStroke();
    }
}
