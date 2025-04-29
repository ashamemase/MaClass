import { SVGLoader } from "./kanjiviewer/SVGLoader.js";
import { kanjiPartsView } from "./kanjiviewer/kanjiPartView.js";
import { kanjiStrokeView } from "./kanjiviewer/kanjiView.js";
import { KanjiQuizView } from "./kanjiviewer/kanjiQuizView.js";
document.addEventListener("DOMContentLoaded", (event) => {
    const params = new URLSearchParams(window.location.search);
    const char = params.get("kanji");
    if (!char)
        return;
    window.SVGLoader = new SVGLoader();
    SVGLoader.loadSVG(char).then((svgEl) => {
        window.kanjiPartsView = new kanjiPartsView(svgEl, "kanji-output__img--parts");
        window.kanjiStrokeView = new kanjiStrokeView(svgEl, "kanji-output__img--stroke");
        window.kanjiQuizView = new KanjiQuizView(svgEl, "kanji-output__practice");
    });
});
