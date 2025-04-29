import { kanjiBase } from "./kanjiView.js";
export class kanjiPartsView {
    constructor(svgElement, containerId) {
        this.svgElement = svgElement;
        this.container = document.getElementById(containerId);
        this.setContainerItems();
    }
    setContainerItems() {
        const gloupElements = this.svgElement.querySelectorAll("g");
        let hasGeneralRadical = false;
        for (let gloupE of gloupElements) {
            const radicalAttribute = gloupE.getAttribute("kvg:radical");
            if (radicalAttribute !== "general")
                continue;
            const radicalStrokeId = gloupE.id;
            this.addRadicalView(radicalStrokeId);
            hasGeneralRadical = true;
        }
        //generalの部首が見つからなかった場合traditの部首を使う
        if (!hasGeneralRadical) {
            for (let gloupE of gloupElements) {
                const radicalAttribute = gloupE.getAttribute("kvg:radical");
                if (radicalAttribute !== "tradit")
                    continue;
                const radicalStrokeId = gloupE.id;
                this.addRadicalView(radicalStrokeId);
                hasGeneralRadical = true;
            }
        }
        for (let gloupE of gloupElements) {
            const phonAttribute = gloupE.getAttribute("kvg:phon");
            if (!phonAttribute)
                continue;
            const phonStrokeId = gloupE.id;
            this.addPhonView(phonStrokeId);
        }
        const usedPart = {};
        for (let gloupE of gloupElements) {
            if (!gloupE.id.match(/kvg:[0-9a-f]+-g\d+/))
                continue;
            const char = gloupE.getAttribute("kvg:element");
            if (char) {
                if (usedPart[char]) {
                    usedPart[char]++;
                    continue;
                }
                else {
                    usedPart[char] = 1;
                }
            }
            else {
                continue;
            }
            const partsStrokeId = gloupE.id;
            this.addPartsView(partsStrokeId);
        }
    }
    createKanjiPartView() {
        const container = document.createElement("div");
        const svgContainer = document.createElement("div");
        const linkContainer = document.createElement("div");
        container.classList.add("kanji-parts--container");
        svgContainer.classList.add("kanji-parts--svg");
        linkContainer.classList.add("kanji-parts--link");
        const kanjiBaseView = new kanjiBase(this.svgElement, svgContainer);
        const kanjiSVG = kanjiBaseView.SVGElement;
        this.container.appendChild(container);
        container.appendChild(svgContainer);
        container.appendChild(linkContainer);
        kanjiBaseView.removeStrokeNumber();
        return { container, svgContainer, linkContainer, kanjiSVG };
    }
    addRadicalView(radicalGroupeId) {
        const { kanjiSVG, linkContainer } = this.createKanjiPartView();
        linkContainer.innerHTML = "Bộ thủ";
        const radicalStroke = kanjiSVG.getElementById(radicalGroupeId);
        radicalStroke === null || radicalStroke === void 0 ? void 0 : radicalStroke.classList.add("radical-stroke");
    }
    addPhonView(phonGroupId) {
        const { kanjiSVG, linkContainer } = this.createKanjiPartView();
        const phonStroke = kanjiSVG.getElementById(phonGroupId);
        const charLink = phonStroke === null || phonStroke === void 0 ? void 0 : phonStroke.getAttribute("kvg:element");
        phonStroke === null || phonStroke === void 0 ? void 0 : phonStroke.classList.add("phon-stroke");
        if (charLink) {
            const linkElement = document.createElement("a");
            linkElement.href = "kanjiDict.php?kanji=" + charLink;
            linkElement.text = "thanh phù";
            linkContainer.appendChild(linkElement);
        }
        else {
            linkContainer.outerHTML = "thanh phù";
        }
    }
    addPartsView(partsGroupId) {
        const { kanjiSVG, linkContainer } = this.createKanjiPartView();
        const partStroke = kanjiSVG.getElementById(partsGroupId);
        const charLink = partStroke === null || partStroke === void 0 ? void 0 : partStroke.getAttribute("kvg:element");
        if (charLink) {
            const parts = kanjiSVG.querySelectorAll("g");
            for (const part of parts) {
                if (part.getAttribute("kvg:element") === charLink) {
                    part.classList.add("emphasis-stroke");
                }
            }
            const linkElement = document.createElement("a");
            linkElement.href = "kanjiDict.php?kanji=" + charLink;
            linkElement.text = charLink;
            linkContainer.appendChild(linkElement);
        }
    }
}
