import { DataProvider } from "./actors/dataProvider.js";
import { ProfessionPreviewer } from "./actors/professionPreviewer.js";

const dataProvider = new DataProvider();
const profPreview = new ProfessionPreviewer(dataProvider);

function createItemLink(wowItem, iconOnly = false, stackSize = 0) {
    const link = document.createElement('a');
    if (wowItem.quality) {
        link.classList.add(wowItem.quality);
    }

    if (iconOnly) {
        link.setAttribute('data-wh-rename-link', 'false');
    } else {
        link.textContent = wowItem.name;
    }

    link.classList.add('text-decoration-none');
    link.setAttribute('href', `https://tbc.wowhead.com/item=${wowItem.itemId}`);
    link.setAttribute('target', '_blank');

    if (stackSize > 0) {
        const numItems = document.createElement('span');
        numItems.textContent = stackSize;
        numItems.classList.add('fs-5', 'fw-bold', 'align-middle');

        const div = document.createElement('div');
        div.style.display = 'inline';
        div.append(numItems, link);
        return div;
    }

    return link;
}

function createSkillLevel(level, rank) {
    const skillLevel = document.createElement('span');
    skillLevel.classList.add(rank, 'fw-bold');
    skillLevel.textContent = level;

    return skillLevel;
}

function createSkillLevelsFromRecipe(recipe) {
    const { orangeLevel, yellowLevel, greenLevel, grayLevel } = recipe;

    const skillLevels = [
        createSkillLevel(orangeLevel, 'r1'),
        ' ',
        createSkillLevel(yellowLevel, 'r2'),
        ' ',
        createSkillLevel(greenLevel, 'r3'),
        ' ',
        createSkillLevel(grayLevel, 'r4'),
    ]

    return skillLevels
}

function getBGColorForSkill(level, recipe) {
    let bgColor = 'rgb(128 128 128 / 30%)';

    if (level < recipe.orangeLevel) {
        bgColor = 'rgb(255 0 0 / 30%)';
    } else if (level < recipe.yellowLevel) {
        bgColor = 'rgb(255 128 64 / 30%)';
    } else if (level < recipe.greenLevel) {
        bgColor = 'rgb(255 255 0 / 30%)';
    } else if (level < recipe.grayLevel) {
        bgColor = 'rgb(64 191 64 / 30%)';
    }

    return bgColor;
}

function buildTable(level) {
    const recipeTable = document.getElementById('recipes');
    // reset current table
    recipeTable.innerHTML = '';

    for (const recipe of profPreview.getAvailableOptions(level)) {
        const nameColumn = document.createElement('td');
        nameColumn.append(createItemLink(recipe));

        const skillUpChanceColumn = document.createElement('td');
        const chanceForSkillUp = (ProfessionPreviewer.getChanceOfSkillUp(level, recipe) * 100 | 0);
        skillUpChanceColumn.style.backgroundColor = getBGColorForSkill(level, recipe);
        skillUpChanceColumn.append(`${chanceForSkillUp}%`);
        skillUpChanceColumn.style.textAlign = 'center';

        const skillColumn = document.createElement('td');
        skillColumn.append(...createSkillLevelsFromRecipe(recipe));
        skillColumn.style.textAlign = 'center';

        const materialColumn = document.createElement('td');
        for (const reagent of recipe.reagents) {
            const reagentLink = createItemLink(reagent, true, reagent.quantity);
            materialColumn.append(reagentLink);
        }

        const row = document.createElement('tr');
        row.append(
            nameColumn,
            skillUpChanceColumn,
            skillColumn,
            materialColumn,
            // craftColumn,
        );

        recipeTable.append(row);
    }

    window.$WowheadPower.refreshLinks();
}

document.getElementById('level').addEventListener('change', function () {
    buildTable(this.value);
});

buildTable(1);

document.getElementById('levelForm').addEventListener('submit', function (event) {
    event.preventDefault();
});