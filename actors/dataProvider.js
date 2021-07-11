import { craftingRecipes as jewelCraftingRecipes } from "../connectors/jcDataProvider.js";
import { craftingRecipes as tailoringRecipes } from "../connectors/tailoringDataProvider.js";
import { craftingRecipes as blackSmithingRecipes } from "../connectors/bsDataProvider.js";
import { craftingRecipes as leatherWorkingRecipes } from "../connectors/lwDataProvider.js";
import { craftingRecipes as alchemyRecipes } from "../connectors/alchemyDataProvider.js";
import { craftingRecipes as enchantingRecipes } from "../connectors/enchantingDataProvider.js";
import { craftingRecipes as engineeringRecipes } from "../connectors/engineeringDataProvider.js";
import { craftingRecipes as cookingRecipes } from "../connectors/cookingDataProvider.js";

const dataSets = {
    alchemy: alchemyRecipes,
    blackSmithing: blackSmithingRecipes,
    cooking: cookingRecipes,
    enchanting: enchantingRecipes,
    engineering: engineeringRecipes,
    leatherWorking: leatherWorkingRecipes,
    jewelCrafting: jewelCraftingRecipes,
    tailoring: tailoringRecipes,
};

export class DataProvider {
    data = [];

    static TYPE_JEWELCRAFTING = 'jewelCrafting';
    static TYPE_TAILORING = 'tailoring';
    static TYPE_BLACKSMITHING = 'blackSmithing';
    static TYPE_LEATHERWORKING = 'leatherWorking';
    static TYPE_ALCHEMY = 'alchemy';
    static TYPE_ENCHANTING = 'enchanting';
    static TYPE_COOKING = 'cooking';
    static TYPE_ENGINEERING = 'engineering';
    static TYPE_REAGENT = 'reagent';

    constructor() {
        for (const dataType in dataSets) {
            for (const item of dataSets[dataType]) {
                if (item.yellowLevel) {
                    if (!Array.isArray(item.types)) {
                        item.types = [];
                    }
                    item.types.push(dataType);
                    this.data.push(DataProvider.createItem(item));

                    for (const reagent of item.reagents) {
                        if (!Array.isArray(reagent.types)) {
                            reagent.types = [];
                        }
                        reagent.types.push(DataProvider.TYPE_REAGENT);
                        this.data.push(DataProvider.createItem(reagent))
                    }
                }
            }
        }
    }

    static professionList() {
        return [
            {
                id: DataProvider.TYPE_ALCHEMY,
                name: 'Alchemy',
            },
            {
                id: DataProvider.TYPE_BLACKSMITHING,
                name: 'Blacksmithing',
            },
            {
                id: DataProvider.TYPE_COOKING,
                name: 'Cooking',
            },
            {
                id: DataProvider.TYPE_ENCHANTING,
                name: 'Enchanting',
            },
            {
                id: DataProvider.TYPE_ENGINEERING,
                name: 'Engineering',
            },
            {
                id: DataProvider.TYPE_LEATHERWORKING,
                name: 'Leatherworking',
            },
            {
                id: DataProvider.TYPE_JEWELCRAFTING,
                name: 'Jewelcrafting',
            },
            {
                id: DataProvider.TYPE_TAILORING,
                name: 'Tailoring',
            },
        ];
    }

    static createItem(pItemInfo) {
        let itemName = pItemInfo.name
        if (!itemName) {
            itemName = pItemInfo.id;
        }

        return {
            itemId: pItemInfo.itemId,
            id: pItemInfo.id,
            spellId: pItemInfo.spellId,
            spellName: pItemInfo.spellName,
            createsItem: pItemInfo.createsItem,
            name: itemName,
            orangeLevel: pItemInfo.orangeLevel,
            yellowLevel: pItemInfo.yellowLevel,
            greenLevel: pItemInfo.greenLevel,
            grayLevel: pItemInfo.grayLevel,
            reagents: pItemInfo.reagents,
            quality: pItemInfo.quality,
            types: pItemInfo.types,
        }
    }

    getRecipes(type) {

        return this.data.filter((item) => {
            return item.types.indexOf(type) !== -1;
        });
    }

    getReagents() {
        return this.data.filter((item) => {
            return item.types.indexOf(DataProvider.TYPE_REAGENT) !== -1;
        });
    }

    getItemByItemId(itemId) {
        return this.data.filter((item) => {
            return item.itemId = itemId;
        })
    }
}
