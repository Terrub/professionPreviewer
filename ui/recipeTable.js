import { ProfessionPreviewer } from "../actors/professionPreviewer.js";

export class RecipeTable {
    profPreview = null;

    constructor(profPreview) {
        this.profPreview = profPreview;
    }

    buildTable(level) {
        const recipeTable = document.getElementById('recipes');
        // reset current table
        recipeTable.innerHTML = '';

        for (const recipe of this.profPreview.getAvailableOptions(level)) {
            const nameColumn = document.createElement('td');
            nameColumn.append(this.createItemLink(recipe));

            const skillUpChanceColumn = document.createElement('td');
            const chanceForSkillUp = ProfessionPreviewer.getChanceOfSkillUp(level, recipe);
            const skillUpPercentage = chanceForSkillUp >= 0 ? (chanceForSkillUp * 100 | 0) : 0;
            skillUpChanceColumn.style.backgroundColor = this.getBGColorForSkill(level, recipe);
            skillUpChanceColumn.append(`${skillUpPercentage}%`);
            skillUpChanceColumn.style.textAlign = 'center';

            const skillColumn = document.createElement('td');
            skillColumn.append(...this.createSkillLevelsFromRecipe(recipe));
            skillColumn.style.textAlign = 'center';

            const materialColumn = document.createElement('td');
            for (const reagent of recipe.reagents) {
                const reagentLink = this.createItemLink(reagent, true, reagent.quantity);
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
                const skillUpChance = this.profPreview.getChanceOfSkillUp(currentLevel, recipe);
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

    addItemToInventory(item, amount) {
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
            itemNameColumn.append(this.createItemLink(item, true));
            itemRow.append(itemNameColumn);

            inventory.append(itemRow);
        }
    }

    createItemLink(wowItem, iconOnly = false, stackSize = 0) {
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
            numItems.textContent = stackSize.toString();
            numItems.classList.add('fs-5', 'fw-bold', 'align-middle');

            const div = document.createElement('div');
            div.style.display = 'inline';
            div.append(numItems, link);
            return div;
        }

        return link;
    }

    createSkillLevelsFromRecipe(recipe) {
        const { orangeLevel, yellowLevel, greenLevel, grayLevel } = recipe;

        return [
            this.createSkillLevel(orangeLevel, 'r1'),
            ' ',
            this.createSkillLevel(yellowLevel, 'r2'),
            ' ',
            this.createSkillLevel(greenLevel, 'r3'),
            ' ',
            this.createSkillLevel(grayLevel, 'r4'),
        ];
    }

    getBGColorForSkill(level, recipe) {
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

    createSkillLevel(level, rank) {
        const skillLevel = document.createElement('span');
        skillLevel.classList.add(rank, 'fw-bold');
        skillLevel.textContent = level;

        return skillLevel;
    }
}