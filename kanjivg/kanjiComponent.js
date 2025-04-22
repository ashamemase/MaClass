document.addEventListener("DOMContentLoaded", () => {
    window.partsViewer = new partsViewer();
    window.partsViewer.setCharactor("郷");
});
class KanjiComponentView {
    constructor(container, kanji, highlightGroupIds, label, onClick) {
        this.container = container;
        this.kanji = kanji;
        this.highlightGroupIds = highlightGroupIds;
        this.label = label;
        this.onClick = onClick;
    }
    async render() {
        // SVGを取得して、highlightGroupIdsに該当する部分を赤く
        // containerに挿入、クリックイベントも設定
    }
}
/*
class KanjiComponentGrid {
  constructor(private container: HTMLElement, private components: KanjiComponentData[]) {}

  renderAll() {
    this.container.innerHTML = "";
    for (const data of this.components) {
      const comp = new KanjiComponentView(this.container, data.kanji, data.highlightGroupIds, data.label, data.onClick);
      comp.render();
    }
  }
}*/
class partsViewer {
    constructor() {
        this.kanjiChar = "";
    }
    /** */
    setCharactor(char) {
        const svgLoader = new SVGLoader();
        svgLoader
            .loadSVG(char)
            .then((svgElemtent) => {
            this.drowPartsSgvs(svgElemtent);
        })
            .catch((err) => {
            console.error("[setCharactor]", err.message);
        });
    }
    drowPartsSgvs(svgElemtent) {
        const baseElement = document.getElementById("Parts-Base");
        if (!baseElement)
            return;
        const gloupElements = svgElemtent.querySelectorAll("g");
        for (let gloupE of gloupElements) {
            const radicalAttribute = gloupE.getAttribute("kvg:radical");
            if (radicalAttribute !== "general")
                continue;
            const radicalStrokeId = gloupE.id;
            const newSvg = svgElemtent.cloneNode(true);
            newSvg.getElementById(radicalStrokeId).classList.add("radical-stroke");
            const gloupNum = newSvg.querySelectorAll('[id^="kvg:StrokeNumbers"]');
            newSvg.removeChild(gloupNum[0]);
            baseElement.appendChild(newSvg);
        }
        for (let gloupE of gloupElements) {
            const emphashisStrokeId = gloupE.id;
            if (!gloupE.id.match(/kvg:[0-9a-f]+-g\d+/))
                continue;
            const newSvg = svgElemtent.cloneNode(true);
            newSvg.getElementById(emphashisStrokeId).classList.add("emphasis-stroke");
            const gloupNum = newSvg.querySelectorAll('[id^="kvg:StrokeNumbers"]');
            newSvg.removeChild(gloupNum[0]);
            baseElement.appendChild(newSvg);
        }
    }
}
class SVGLoader {
    constructor() { }
    async loadSVG(char) {
        const codePoint = char.codePointAt(0);
        if (!codePoint)
            throw new Error("[loadSVG] char not set");
        const fileName = codePoint.toString(16).toLowerCase().padStart(5, "0");
        const response = await fetch(`/kanji/${fileName}.svg`);
        const text = await response.text();
        const match = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
        if (!match) {
            throw new Error("[loadSVG] SVG tag not found");
        }
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = svgDoc.querySelector("svg");
        return svgEl;
    }
}
export {};
