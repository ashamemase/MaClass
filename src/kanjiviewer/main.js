import { SVGLoader } from "./SVGLoader";
export class KanjiViewer {
    constructor(mainViewId, strokeViewId, partsViewId, practiceViewId) {
        this.kanjiChar = "";
        this.mainViewId = mainViewId;
        this.srtokeViewId = strokeViewId;
        this.partsViewId = partsViewId;
        this.practiceViewId = practiceViewId;
    }
    static create(kanjiChar, mainViewId, strokeViewId, partsViewId, practiceViewId) {
        const kanjiviewer = new KanjiViewer(mainViewId, strokeViewId, partsViewId, practiceViewId);
        kanjiviewer.setCharactor(kanjiChar);
        return kanjiviewer;
    }
    async setCharactor(kanjiChar) {
        this.kanjiChar = kanjiChar;
        try {
            const sgvEl = await SVGLoader.loadSVG(this.kanjiChar);
        }
        catch (err) {
            console.error("[KanjiViewer:setCharactor]", err.message);
        }
    }
}
