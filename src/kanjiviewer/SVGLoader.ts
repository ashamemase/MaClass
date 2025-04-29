export class SVGLoader {
  constructor() {}

  public static async loadSVG(char: string): Promise<SVGSVGElement> {
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
}