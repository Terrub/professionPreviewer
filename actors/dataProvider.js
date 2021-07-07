import { craftingRecipes } from "../connectors/jcDataProvider.js";

const dataSets = {
    jewelCrafting: craftingRecipes,
};

export class DataProvider {
    data = [];

    static TYPE_JEWELCRAFTING = 'jewelCrafting';
    static TYPE_REAGENT = 'reagent';

    constructor() {
        for (const dataType in dataSets) {
            for (const item of dataSets[dataType]) {
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

    static createItem(pItemInfo) {
        let itemName = pItemInfo.name
        if (!itemName) {
            itemName = pItemInfo.id;
        }

        return {
            itemId: pItemInfo.itemId,
            id: pItemInfo.id,
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
