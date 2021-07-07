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

function addItemToInventory(item, amount) {
    const inventory = document.getElementById('inventory_items');
    const currentStack = document.getElementById(`inventory_${item.itemId}`);
    if (currentStack) {
        const oldAmount = parseInt(currentStack.querySelector('span[name="amount"]').textContent, 10);
        const newAmount = oldAmount + amount;
        currentStack.querySelector('span[name="amount"]').textContent = newAmount;
    } else {
        const itemRow = document.createElement('tr');
        itemRow.setAttribute('id', `inventory_${item.itemId}`);

        const itemAmountColumn = document.createElement('td');
        const itemAmount = document.createElement('span');
        itemAmount.setAttribute('name', 'amount')
        itemAmount.textContent = amount;
        itemAmountColumn.append(itemAmount)
        itemRow.append(itemAmountColumn);

        const itemNameColumn = document.createElement('td');
        itemNameColumn.append(createItemLink(item, true));
        itemRow.append(itemNameColumn);

        inventory.append(itemRow);
    }
}

function buildTable(level) {
    const recipeTable = document.getElementById('recipes');
    // reset current table
    recipeTable.innerHTML = '';

    for (const recipe of profPreview.getAvailableOptions(level)) {
        const nameColumn = document.createElement('td');
        nameColumn.append(createItemLink(recipe));

        const skillUpChanceColumn = document.createElement('td');
        const chanceForSkillUp = ProfessionPreviewer.getChanceOfSkillUp(level, recipe);
        const skillUpPercentage = chanceForSkillUp >= 0 ? (chanceForSkillUp * 100 | 0) : 0;
        skillUpChanceColumn.style.backgroundColor = getBGColorForSkill(level, recipe);
        skillUpChanceColumn.append(`${skillUpPercentage}%`);
        skillUpChanceColumn.style.textAlign = 'center';

        const skillColumn = document.createElement('td');
        skillColumn.append(...createSkillLevelsFromRecipe(recipe));
        skillColumn.style.textAlign = 'center';

        const materialColumn = document.createElement('td');
        for (const reagent of recipe.reagents) {
            const reagentLink = createItemLink(reagent, true, reagent.quantity);
            materialColumn.append(reagentLink);
        }

        const craftColumn = document.createElement('td');
        const craftButton = document.createElement('button');
        craftButton.textContent = 'Craft';
        craftButton.onclick = () => {
            for (const item of recipe.reagents) {
                addItemToInventory(item, item.quantity);
            }

            const levelElement = document.getElementById('level');
            const currentLevel = parseInt(levelElement.value, 10);
            const skillUpChance = ProfessionPreviewer.getChanceOfSkillUp(currentLevel, recipe);
            if ((Math.random() + skillUpChance | 0) === 1) {
                levelElement.value = currentLevel + 1;
                levelElement.dispatchEvent(new Event('change'));
            }

            window.$WowheadPower.refreshLinks();
        };
        craftColumn.append(craftButton);

        const row = document.createElement('tr');
        row.append(
            nameColumn,
            skillUpChanceColumn,
            skillColumn,
            materialColumn,
            craftColumn,
        );

        recipeTable.append(row);
    }

    window.$WowheadPower.refreshLinks();
}

document.getElementById('level').addEventListener('change', (event) => {
    buildTable(event.target.value);
});

document.getElementById('toggle_inventory').addEventListener('click', () => {
    const inventory = document.getElementById('inventory');
    if (inventory.classList.contains('d-none')) {
        inventory.classList.add('d-block');
        inventory.classList.remove('d-none');
    } else if (inventory.classList.contains('d-block')) {
        inventory.classList.add('d-none');
        inventory.classList.remove('d-block');
    }
});

document.getElementById('levelForm').addEventListener('submit', (event) => {
    event.preventDefault();
});

buildTable(1);
