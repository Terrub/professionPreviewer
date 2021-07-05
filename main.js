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
    document.getElementById('recipes').innerHTML = '';

    for (const recipe of profPreview.getAvailableOptions(this.value)) {
        let row = document.createElement('tr');

        let nameColumn = document.createElement('td');
        let link = document.createElement('a');
        link.setAttribute('class', recipe.quality);
        link.setAttribute('href', 'https://tbc.wowhead.com/item=' +  recipe.itemId);
        link.setAttribute('target', '_blank');
        link.setAttribute('data-wowhead', 'domain=tbc&item=' + recipe.itemId);
        link.textContent = recipe.name;
        nameColumn.append(link);
        row.append(nameColumn);

        let skillColumn = document.createElement('td');
        skillColumn.textContent = recipe.orangeLevel + ' / ' + recipe.yellowLevel + ' / ' + recipe.greenLevel + ' / ' + recipe.grayLevel;
        row.append(skillColumn);

        let materialColumn = document.createElement('td');
        let list = document.createElement('ul');
        for (const reagent of recipe.reagents) {
            let reagentListItem = document.createElement('li');
            reagentListItem.textContent = reagent.id;
            list.append(reagentListItem);
        }
        materialColumn.append(list);
        row.append(materialColumn);


        document.getElementById('recipes').append(row);
    }
});

document.getElementById('levelForm').addEventListener('submit', function(event) {
   event.preventDefault();
});