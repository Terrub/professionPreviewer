import { ProfessionPreviewer } from "./actors/professionPreviewer.js";
import { JCDataProvider } from "./connectors/jcDataProvider.js";

// debugger;
const jcdp = new JCDataProvider();

const profPreview = new ProfessionPreviewer(jcdp);
for (const lvl of [1, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 310, 320, 330, 340, 350, 360, 370]) {
    console.log(lvl, profPreview.getAvailableOptions(lvl));
}

for (const recipe of profPreview.getAvailableOptions(109)) {
    console.log(ProfessionPreviewer.getChanceOfSkillUp(125, recipe), recipe);
}
