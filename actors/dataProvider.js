import { craftingRecipes } from "../connectors/jcDataProvider.js";

const dataSets = {
    jewelCrafting: craftingRecipes,
};

export class DataProvider {
    data = [];

    static TYPE_JEWELCRAFTING = 'jewelCrafting';

    constructor() {
        for (const dataType in dataSets) {
            for (const item of dataSets[dataType]) {
                item.type = dataType;
                this.data.push(item);
            }
        }
    }

    getRecipes(type) {
        return this.data.filter((item) => {
            return item.type === type;
        });
    }
}