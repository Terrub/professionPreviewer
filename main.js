import { ProfessionPreviewer } from "./actors/professionPreviewer.js";
import { JCDataProvider } from "./connectors/jcDataProvider.js";

// debugger;
const jcdp = new JCDataProvider();

const profPreview = new ProfessionPreviewer(jcdp);
// for (const lvl of [1, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 310, 320, 330, 340, 350, 360, 370]) {
//     console.log(lvl, profPreview.getAvailableOptions(lvl));
// }
//
// for (const recipe of profPreview.getAvailableOptions(109)) {
//     console.log(ProfessionPreviewer.getChanceOfSkillUp(125, recipe), recipe);
// }

document.getElementById('level').addEventListener('change', function() {
    buildTable(this.value);
});

const buildTable = function(level) {
    document.getElementById('recipes').innerHTML = '';

    for (const recipe of profPreview.getAvailableOptions(level)) {
        let row = document.createElement('tr');

        let nameColumn = document.createElement('td');
        nameColumn.setAttribute('class', 'align-middle');
        let link = document.createElement('a');
        link.setAttribute('class', recipe.quality);
        link.setAttribute('href', 'https://tbc.wowhead.com/item=' +  recipe.itemId);
        link.setAttribute('target', '_blank');
        link.setAttribute('data-wowhead', 'domain=tbc&item=' + recipe.itemId);
        link.textContent = recipe.name;
        nameColumn.append(link);
        row.append(nameColumn);

        let skillColumn = document.createElement('td');
        skillColumn.setAttribute('class', 'align-middle');
        skillColumn.innerHTML = '<span class="r1">' + recipe.orangeLevel + '</span> / <span class="r2">' + recipe.yellowLevel + '</span> / <span class="r3">' + recipe.greenLevel + '</span> / <span class="r4">' + recipe.grayLevel + '</span>';
        row.append(skillColumn);

        let materialColumn = document.createElement('td');
        materialColumn.setAttribute('class', 'align-middle');
        for (const reagent of recipe.reagents) {
            let reagentLink = document.createElement('a');
            reagentLink.setAttribute('href', 'https://tbc.wowhead.com/item=' +  reagent.itemId);
            reagentLink.setAttribute('target', '_blank');
            reagentLink.setAttribute('data-wh-rename-link', 'false');
            materialColumn.textContent = reagent.quantity + 'x ';
            materialColumn.append(reagentLink);
        }
        row.append(materialColumn);


        document.getElementById('recipes').append(row);

        window.$WowheadPower.refreshLinks();
    }
}

buildTable(1);

document.getElementById('levelForm').addEventListener('submit', function(event) {
   event.preventDefault();
});