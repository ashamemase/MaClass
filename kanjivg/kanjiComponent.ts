export {};
declare global {
  interface Window {
    partsViewer: partsViewer;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.partsViewer = new partsViewer();
  window.partsViewer.setCharactor("郷");
});

class KanjiComponentView {
  constructor(
    private container: HTMLElement,
    private kanji: string,
    private highlightGroupIds: string[],
    private label?: string,
    private onClick?: () => void
  ) {}

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
  private kanjiChar: string = "";
  constructor() {}
  /** */
  public setCharactor(char: string) {
    const svgLoader = new SVGLoader();
    svgLoader
      .loadSVG(char)
      .then((svgElemtent) => {
        this.drowPartsSgvs(svgElemtent);
      })
      .catch((err) => {
        console.error("[setCharactor]", (err as Error).message);
      });
  }

  private drowPartsSgvs(svgElemtent: SVGSVGElement) {
    const baseElement = document.getElementById("Parts-Base");
    if (!baseElement) return;
    const gloupElements = svgElemtent.querySelectorAll("g") as NodeListOf<SVGGElement>;
    for (let gloupE of gloupElements) {
      const radicalAttribute = gloupE.getAttribute("kvg:radical");
      if (radicalAttribute !== "general") continue;
      const radicalStrokeId = gloupE.id;
      const newSvg = svgElemtent.cloneNode(true) as SVGSVGElement;
      newSvg.getElementById(radicalStrokeId).classList.add("radical-stroke");
      const gloupNum = newSvg.querySelectorAll('[id^="kvg:StrokeNumbers"]');
      newSvg.removeChild(gloupNum[0]);
      baseElement.appendChild(newSvg);
    }
    for (let gloupE of gloupElements) {
      const emphashisStrokeId = gloupE.id;
      if (!gloupE.id.match(/kvg:[0-9a-f]+-g\d+/)) continue;
      const newSvg = svgElemtent.cloneNode(true) as SVGSVGElement;
      newSvg.getElementById(emphashisStrokeId).classList.add("emphasis-stroke");
      const gloupNum = newSvg.querySelectorAll('[id^="kvg:StrokeNumbers"]');
      newSvg.removeChild(gloupNum[0]);
      baseElement.appendChild(newSvg);
    }
  }
}

class SVGLoader {
  constructor() {}

  public async loadSVG(char: string): Promise<SVGSVGElement> {
    const codePoint = char.codePointAt(0);
    if (!codePoint) throw new Error("[loadSVG] char not set");
    const fileName = codePoint.toString(16).toLowerCase().padStart(5, "0");

    const response = await fetch(`/kanji/${fileName}.svg`);
    const text = await response.text();
    const match = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
    if (!match) {
      throw new Error("[loadSVG] SVG tag not found");
    }
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, "image/svg+xml");
    const svgEl = svgDoc.querySelector("svg") as SVGSVGElement;
    return svgEl;
  }
  /* private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public async load(char: string): Promise<void> {
    const codePoint = char.codePointAt(0);
    if (!codePoint) return;

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
      if (!container) return;

      const { width: divW, height: divH } = container.getBoundingClientRect();

      const vb = svgEl.getAttribute("viewBox")?.split(" ").map(Number);
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
    } catch (err) {
      console.error("SVGの読み込みに失敗しました:", err);
    }
  }*/
}
