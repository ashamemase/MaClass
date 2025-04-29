import { SVGLoader } from "./SVGLoader";

export class KanjiViewer{
    kanjiChar:string="";
    mainViewId:string;
    srtokeViewId:string;
    partsViewId:string;
    practiceViewId:string;

    constructor(mainViewId:string,strokeViewId:string,partsViewId:string,practiceViewId:string){
        this.mainViewId=mainViewId;
        this.srtokeViewId=strokeViewId;
        this.partsViewId=partsViewId;
        this.practiceViewId=practiceViewId;
    }
    public static create(kanjiChar:string,mainViewId:string,strokeViewId:string,partsViewId:string,practiceViewId:string): KanjiViewer{
        const kanjiviewer= new KanjiViewer(mainViewId,strokeViewId,partsViewId,practiceViewId);
        kanjiviewer.setCharactor(kanjiChar);
        return kanjiviewer;
    }
    public async setCharactor(kanjiChar:string){
        this.kanjiChar=kanjiChar;
        try{
            const sgvEl=await SVGLoader.loadSVG(this.kanjiChar);

        }catch(err){
            console.error("[KanjiViewer:setCharactor]",(err as Error).message);
        }

    }

}