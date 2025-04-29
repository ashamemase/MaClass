export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    }
    static subtract(p1, p2) {
        return { x: p1.x - p2.x, y: p1.y - p2.y };
    }
    static distance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    static scalerMultiply(p1, multiplier) {
        return { x: p1.x * multiplier, y: p1.y * multiplier };
    }
    static scalerDivide(p1, divider) {
        return { x: p1.x / divider, y: p1.y / divider };
    }
    /**絶対値を返します*/
    static magnitude(p1) {
        return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
    }
    /**全ての点の平均一を求めます */
    static average(points) {
        const point = points.reduce((acc, val) => this.add(acc, val), {
            x: 0,
            y: 0,
        });
        return this.scalerDivide(point, Point.length);
    }
    /**全ての点を順に結んだ時の長さを返します */
    static pointsLength(points) {
        let lastPoint = points[0];
        const pointsRemain = points.slice(1);
        return pointsRemain.reduce((acc, point) => {
            const dist = this.distance(point, lastPoint);
            lastPoint = point;
            return acc + dist;
        }, 0);
    }
    /**二点が同じであるか、評価します */
    static equals(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }
    /**順に並んでいる点で隣り合う点同士が同じであるものを消去します */
    static stripDuplicates(points) {
        if (points.length < 2)
            return points;
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
    static innerProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
    /**p1とp2の線分をp2よりdist倍分だけ延長します */
    static _extendPointOnLine(p1, p2, dist) {
        const vect = { x: p2.x - p1.x, y: p2.y - p1.y };
        const norm = dist / Math.sqrt(Math.pow(vect.x, 2) + Math.pow(vect.y, 2));
        return { x: p2.x + norm * vect.x, y: p2.y + norm * vect.y };
    }
    /**Point[]で結ばれた線分を基に、Point数をnumPointsに修正したPoint[]を返します */
    static outlineCurve(curve, numPoints = 30) {
        const curveLength = this.pointsLength(curve);
        const segmentLength = curveLength / (numPoints - 1);
        const outlinePoints = [curve[0]];
        const endPoint = curve[curve.length - 1];
        const remainingCurvePoints = curve.slice(1);
        for (let i = 0; i < numPoints - 2; i++) {
            let lastPoint = outlinePoints[outlinePoints.length - 1];
            let remainingDist = segmentLength;
            let outlinePointFound = false;
            while (!outlinePointFound) {
                const nextPointDist = this.distance(lastPoint, remainingCurvePoints[0]);
                if (nextPointDist < remainingDist) {
                    remainingDist -= nextPointDist;
                    lastPoint = remainingCurvePoints.shift();
                }
                else {
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
    static normalizeCurve(curve) {
        const outlinedCurve = this.outlineCurve(curve);
        const mean = this.average(curve);
        const translatedCurve = outlinedCurve.map((point) => this.subtract(point, mean));
        const scale = Math.sqrt((Math.pow(translatedCurve[0].x, 2) +
            Math.pow(translatedCurve[0].y, 2) +
            Math.pow(translatedCurve[translatedCurve.length - 1].x, 2) +
            Math.pow(translatedCurve[translatedCurve.length - 1].y, 2)) /
            2);
        const scaledCurve = translatedCurve.map((point) => this.scalerDivide(point, scale));
        return this.subdivideCurve(scaledCurve);
    }
    /**Point[]で結ばれた線分を細かく分割して、新たなPoint[]を返します */
    static subdivideCurve(curve, maxLen = 0.05) {
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
            }
            else {
                newCurve.push(point);
            }
        }
        return newCurve;
    }
    /**pointsBaseの各点について、一番近いpointsReferenceの点までの距離の平均値を返します*/
    static getAverageDistance(pointsBase, pointsReference) {
        const totalDist = pointsBase.reduce((acc, pointBas) => {
            const distances = pointsReference.map((pointRef) => this.distance(pointBas, pointRef));
            return acc + Math.min(...distances);
        }, 0);
        return totalDist / pointsBase.length;
    }
    /**二つの線分のフレシェ距離を計算して返します */
    static frechetDistance(curve1, curve2) {
        const longCurve = curve1.length >= curve2.length ? curve1 : curve2;
        const shortCurve = curve1.length >= curve2.length ? curve2 : curve1;
        const calcVal = (i, j, prevResultsCol, curResultsCol) => {
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
        let prevResultsCol = [];
        for (let i = 0; i < longCurve.length; i++) {
            const curResultsCol = [];
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
    static rotate(curve, theta) {
        return curve.map((point) => ({
            x: Math.cos(theta) * point.x - Math.sin(theta) * point.y,
            y: Math.sin(theta) * point.x + Math.cos(theta) * point.y,
        }));
    }
    /**全ての点から次の点へのベクトルを生成します */
    static getEdgeVectors(points) {
        const vectors = [];
        let lastPoint = points[0];
        points.slice(1).forEach((point) => {
            vectors.push(this.subtract(point, lastPoint));
            lastPoint = point;
        });
        return vectors;
    }
    /**二つのベクトルのなす角のコサインを求めます */
    static cosineSimilarity(p1, p2) {
        return Point.innerProduct(p1, p2) / (Point.magnitude(p1) * Point.magnitude(p2));
    }
}
